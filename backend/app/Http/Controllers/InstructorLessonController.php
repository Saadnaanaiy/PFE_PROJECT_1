<?php

namespace App\Http\Controllers;

use App\Models\Lecon;
use App\Models\Video;
use App\Models\Section;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class InstructorLessonController extends Controller
{
    // Get lessons for a specific section
    public function getLessons($courseId, $sectionId)
    {
        $instructeur = Auth::user()->instructeur;

        // Check if course belongs to instructor
        $section = Section::whereHas('cours', function ($query) use ($instructeur, $courseId) {
            $query->where('instructeur_id', $instructeur->id)
                ->where('id', $courseId);
        })->where('id', $sectionId)->first();

        if (!$section) {
            return response()->json([
                'message' => 'Section not found or you do not have permission'
            ], 404);
        }

        $lecons = $section->lecons()->with('video')->orderBy('ordre')->get();

        return response()->json([
            'lessons' => $lecons
        ]);
    }

    // Create a new lesson
    public function storeLesson(Request $request, $courseId, $sectionId)
    {
        $request->validate([
            'titre' => 'required|string|max:255',
            'ordre' => 'nullable|integer|min:0',
            'estGratuite' => 'nullable|boolean',
            'video' => 'nullable|array',
            'video.titre' => 'required_with:video|string|max:255',
            'video.url' => 'required_with:video|string|max:500',
            'video.dureeMinutes' => 'required_with:video|integer|min:0',
        ]);

        $instructeur = Auth::user()->instructeur;

        // Check if course belongs to instructor
        $section = Section::whereHas('cours', function ($query) use ($instructeur, $courseId) {
            $query->where('instructeur_id', $instructeur->id)
                ->where('id', $courseId);
        })->where('id', $sectionId)->first();

        if (!$section) {
            return response()->json([
                'message' => 'Section not found or you do not have permission'
            ], 404);
        }

        $leconData = $request->only(['titre', 'ordre', 'estGratuite']);
        $leconData['section_id'] = $sectionId;

        // If no order provided, place at the end
        if (!isset($leconData['ordre'])) {
            $lastOrder = $section->lecons()->max('ordre') ?? 0;
            $leconData['ordre'] = $lastOrder + 1;
        }

        // Default estGratuite to false if not provided
        if (!isset($leconData['estGratuite'])) {
            $leconData['estGratuite'] = false;
        }

        $lecon = Lecon::create($leconData);

        // Create video if provided
        if ($request->has('video')) {
            $videoData = $request->input('video');
            $videoData['lecon_id'] = $lecon->id;
            $video = Video::create($videoData);
            $lecon->video = $video;
        }

        return response()->json([
            'message' => 'Lesson created successfully',
            'lesson' => $lecon
        ], 201);
    }

    // Update a lesson
    public function updateLesson(Request $request, $courseId, $sectionId, $lessonId)
    {
        $request->validate([
            'titre' => 'sometimes|required|string|max:255',
            'ordre' => 'sometimes|required|integer|min:0',
            'estGratuite' => 'sometimes|required|boolean',
            'video' => 'nullable|array',
            'video.titre' => 'required_with:video|string|max:255',
            'video.url' => 'required_with:video|string|max:500',
            'video.dureeMinutes' => 'required_with:video|integer|min:0',
        ]);

        $instructeur = Auth::user()->instructeur;

        // Check if course belongs to instructor
        $lecon = Lecon::whereHas('section.cours', function ($query) use ($instructeur, $courseId) {
            $query->where('instructeur_id', $instructeur->id)
                ->where('id', $courseId);
        })->where('section_id', $sectionId)
            ->where('id', $lessonId)
            ->first();

        if (!$lecon) {
            return response()->json([
                'message' => 'Lesson not found or you do not have permission'
            ], 404);
        }

        $lecon->update($request->only(['titre', 'ordre', 'estGratuite']));

        // Update or create video
        if ($request->has('video')) {
            $videoData = $request->input('video');

            if ($lecon->video) {
                $lecon->video->update($videoData);
            } else {
                $videoData['lecon_id'] = $lecon->id;
                $video = Video::create($videoData);
                $lecon->video = $video;
            }
        }

        // Reload lesson with video relation
        $lecon->load('video');

        return response()->json([
            'message' => 'Lesson updated successfully',
            'lesson' => $lecon
        ]);
    }

    // Delete a lesson
    public function destroyLesson($courseId, $sectionId, $lessonId)
    {
        $instructeur = Auth::user()->instructeur;

        // Check if course belongs to instructor
        $lecon = Lecon::whereHas('section.cours', function ($query) use ($instructeur, $courseId) {
            $query->where('instructeur_id', $instructeur->id)
                ->where('id', $courseId);
        })->where('section_id', $sectionId)
            ->where('id', $lessonId)
            ->first();

        if (!$lecon) {
            return response()->json([
                'message' => 'Lesson not found or you do not have permission'
            ], 404);
        }

        // Delete related video first
        if ($lecon->video) {
            $lecon->video->delete();
        }

        $lecon->delete();

        return response()->json([
            'message' => 'Lesson deleted successfully'
        ]);
    }

    // Reorder lessons
    public function reorderLessons(Request $request, $courseId, $sectionId)
    {
        $request->validate([
            'lessons' => 'required|array',
            'lessons.*.id' => 'required|exists:lecons,id',
            'lessons.*.ordre' => 'required|integer|min:0',
        ]);

        $instructeur = Auth::user()->instructeur;

        // Check if course belongs to instructor
        $section = Section::whereHas('cours', function ($query) use ($instructeur, $courseId) {
            $query->where('instructeur_id', $instructeur->id)
                ->where('id', $courseId);
        })->where('id', $sectionId)->first();

        if (!$section) {
            return response()->json([
                'message' => 'Section not found or you do not have permission'
            ], 404);
        }

        foreach ($request->lessons as $lessonData) {
            $lecon = Lecon::where('id', $lessonData['id'])
                ->where('section_id', $sectionId)
                ->first();

            if ($lecon) {
                $lecon->ordre = $lessonData['ordre'];
                $lecon->save();
            }
        }

        return response()->json([
            'message' => 'Lessons reordered successfully'
        ]);
    }

    public function storeSection(Request $request, $courseId)
    {
        $request->validate([
            'titre' => 'required|string|max:255',
            'ordre' => 'nullable|integer|min:0',
            'lecons' => 'nullable|array',
            'lecons.*.titre' => 'required|string|max:255',
            'lecons.*.ordre' => 'nullable|integer|min:0',
            'lecons.*.estGratuite' => 'nullable|boolean',
            'lecons.*.video' => 'nullable|array',
            'lecons.*.video.titre' => 'required_with:lecons.*.video|string|max:255',
            'lecons.*.video.url' => 'required_with:lecons.*.video|string|max:500',
            'lecons.*.video.dureeMinutes' => 'required_with:lecons.*.video|integer|min:0',
        ]);

        $instructeur = Auth::user()->instructeur;

        $cours = Cours::where('id', $courseId)
            ->where('instructeur_id', $instructeur->id)
            ->first();

        if (!$cours) {
            return response()->json([
                'message' => 'Course not found or you do not have permission'
            ], 404);
        }

        $data = $request->only(['titre', 'ordre']);
        $data['cours_id'] = $courseId;

        // If no order provided, place at the end
        if (!isset($data['ordre'])) {
            $lastOrder = $cours->sections()->max('ordre') ?? 0;
            $data['ordre'] = $lastOrder + 1;
        }

        $section = Section::create($data);

        // Create lessons if provided
        if ($request->has('lecons') && is_array($request->lecons)) {
            foreach ($request->lecons as $index => $leconData) {
                // Set section_id
                $leconData['section_id'] = $section->id;

                // If no lesson order provided, use the index
                if (!isset($leconData['ordre'])) {
                    $leconData['ordre'] = $index;
                }

                // Default estGratuite to false if not provided
                if (!isset($leconData['estGratuite'])) {
                    $leconData['estGratuite'] = false;
                }

                // Create the lesson
                $lecon = Lecon::create([
                    'titre' => $leconData['titre'],
                    'ordre' => $leconData['ordre'],
                    'estGratuite' => $leconData['estGratuite'],
                    'section_id' => $section->id
                ]);

                // Create video if provided
                if (isset($leconData['video'])) {
                    $videoData = $leconData['video'];
                    $videoData['lecon_id'] = $lecon->id;

                    Video::create([
                        'titre' => $videoData['titre'],
                        'url' => $videoData['url'],
                        'dureeMinutes' => $videoData['dureeMinutes'],
                        'lecon_id' => $lecon->id
                    ]);
                }
            }
        }

        // Load the section with its lessons and videos
        $section = Section::with(['lecons.video'])->find($section->id);

        return response()->json([
            'message' => 'Section created successfully',
            'section' => $section
        ], 201);
    }
}
