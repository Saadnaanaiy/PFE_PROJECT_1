<?php

namespace App\Http\Controllers;

use App\Models\Cours;
use App\Models\Categorie;
use App\Models\Lecon;
use App\Models\Section;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class InstructorCourseController extends Controller
{
    // List instructor's courses
    public function index(Request $request)
{
    $user = Auth::user();
    $instructeur = $user->instructeur;

    if (! $instructeur) {
        return response()->json([
            'message' => 'You are not registered as an instructor'
        ], 403);
    }

    // On part d’une query builder sur les cours de cet instructeur
    $query = $instructeur->cours()->with('categorie');

    // Si un filtre categorie_id est passé en query string, on l’applique
    if ($request->has('categorie_id') && $request->categorie_id) {
        $query->where('categorie_id', $request->categorie_id);
    }

    // On peut ici ajouter d’autres filtres (search, prix, etc.)

    // Exécution de la requête
    $cours = $query->get();

    // Transformation éventuelle des URLs d’images
    $cours->transform(function ($course) {
        if ($course->image) {
            $course->image = asset('storage/' . $course->image);
        }
        return $course;
    });

    return response()->json([
        'courses' => $cours
    ]);
}

    // Create a new course
    // Create a new course
    public function store(Request $request)
    {
        $request->validate([
            'titre' => 'required|string|max:255',
            'description' => 'required|string',
            'prix' => 'required|numeric|min:0',
            'niveau' => 'required|string|in:Débutant,Intermédiaire,Avancé',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'dureeMinutes' => 'required|integer|min:0',
            'categorie_id' => 'required|exists:categories,id',
            'sections' => 'nullable|array',
            'sections.*.titre' => 'required|string|max:255',
            'sections.*.ordre' => 'nullable|integer|min:0',
        ]);

        $instructeur = Auth::user()->instructeur;

        if (!$instructeur) {
            return response()->json([
                'message' => 'You are not registered as an instructor'
            ], 403);
        }

        $data = $request->except(['sections', 'image']);
        $data['instructeur_id'] = $instructeur->id;
        $data['progress'] = 0;

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('cours', 'public');
            $data['image'] = $path;
        }

        $cours = Cours::create($data);

        // Create sections if provided
        if ($request->has('sections')) {
            foreach ($request->sections as $index => $sectionData) {
                $sectionData['cours_id'] = $cours->id;

                // If ordre is not set, use the index
                if (!isset($sectionData['ordre'])) {
                    $sectionData['ordre'] = $index;
                }

                Section::create($sectionData);
            }
        }

        // Load the course with its sections
        $cours = Cours::with(['categorie', 'sections'])->find($cours->id);

        return response()->json([
            'message' => 'Course created successfully',
            'course' => $cours
        ], 201);
    }
    // Show a specific course
    public function show($id)
    {
        $instructeur = Auth::user()->instructeur;

        $cours = Cours::where('id', $id)
            ->where('instructeur_id', $instructeur->id)
            ->with('categorie')
            ->first();

        if (!$cours) {
            return response()->json([
                'message' => 'Course not found or you do not have permission'
            ], 404);
        }


        $courseData = $cours->toArray();


        if ($cours->image) {
            $courseData['image'] = asset('storage/' . $cours->image);
        }

        return response()->json([
            'course' => $courseData
        ]);
    }

    // Update a course
    public function update(Request $request, $id)
    {
        $request->validate([
            'titre' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'prix' => 'sometimes|required|numeric|min:0',
            'niveau' => 'sometimes|required|string|in:Débutant,Intermédiaire,Avancé',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'dureeMinutes' => 'sometimes|required|integer|min:0',
            'progress' => 'sometimes|required|integer|min:0|max:100',
            'categorie_id' => 'sometimes|required|exists:categories,id',
        ]);

        $instructeur = Auth::user()->instructeur;

        $cours = Cours::where('id', $id)
            ->where('instructeur_id', $instructeur->id)
            ->first();

        if (!$cours) {
            return response()->json([
                'message' => 'Course not found or you do not have permission'
            ], 404);
        }

        $data = $request->except(['image']);

        if ($request->hasFile('image')) {
            if ($cours->image) {
                Storage::disk('public')->delete($cours->image);
            }

            $path = $request->file('image')->store('cours', 'public');
            $data['image'] = $path;
        }

        $cours->update($data);

        // Load the category relationship
        $cours->load('categorie');

        // Create a course data array with the full image URL
        $courseData = $cours->toArray();

        // Replace the image path with the full URL
        if ($cours->image) {
            $courseData['image'] = asset('storage/' . $cours->image);
        }

        return response()->json([
            'message' => 'Course updated successfully',
            'course' => $courseData
        ]);
    }

    // Delete a course
    public function destroy($id)
    {
        $instructeur = Auth::user()->instructeur;

        $cours = Cours::where('id', $id)
            ->where('instructeur_id', $instructeur->id)
            ->first();

        if (!$cours) {
            return response()->json([
                'message' => 'Course not found or you do not have permission'
            ], 404);
        }

        if ($cours->image) {
            Storage::disk('public')->delete($cours->image);
        }

        $cours->delete();

        return response()->json([
            'message' => 'Course deleted successfully'
        ]);
    }

    // Get all categories
    public function getCategories()
{
    $instructeur = Auth::user()->instructeur;

    if (!$instructeur) {
        return response()->json([
            'message' => 'You are not registered as an instructor'
        ], 403);
    }

    // Fetch categories that have courses by this instructor, and count only those courses
    $categories = Categorie::whereHas('cours', function ($query) use ($instructeur) {
        $query->where('instructeur_id', $instructeur->id);
    })
    ->withCount(['cours as count' => function ($query) use ($instructeur) {
        $query->where('instructeur_id', $instructeur->id);
    }])
    ->get();

    // Add full image URL
    foreach ($categories as $category) {
        if ($category->image) {
            $category->image = asset('storage/' . $category->image);
        }
    }

    return response()->json([
        'categories' => $categories
    ]);
}


// Create a new category
public function storeCategorie(Request $request)
{
    $validated = $request->validate([
        'nom' => 'required|string|max:255|unique:categories,nom',
        'description' => 'nullable|string|max:1000',
        'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
    ]);

    // Handle image upload
    if ($request->hasFile('image')) {
        $imagePath = $request->file('image')->store('categories', 'public');
        $validated['image'] = $imagePath;
    }

    $categorie = Categorie::create($validated);

    // Update the image with the full URL in the response
    if (isset($validated['image'])) {
        $categorie->image = asset('storage/' . $validated['image']);
    }

    return response()->json([
        'message' => 'Category created successfully.',
        'categorie' => $categorie,
    ], 201);
}

// Update a category
public function updateCategorie(Request $request, $id)
{
    $categorie = Categorie::findOrFail($id);

    $validated = $request->validate([
        'nom' => 'sometimes|required|string|max:255|unique:categories,nom,' . $id,
        'description' => 'nullable|string|max:1000',
        'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
    ]);

    // Handle image upload
    if ($request->hasFile('image')) {
        // Delete old image if exists
        if ($categorie->image && Storage::disk('public')->exists($categorie->image)) {
            Storage::disk('public')->delete($categorie->image);
        }

        $imagePath = $request->file('image')->store('categories', 'public');
        $validated['image'] = $imagePath;
    }

    $categorie->update($validated);

    // Update image with full URL for response
    if ($categorie->image) {
        $categorie->image = asset('storage/' . $categorie->image);
    }

    return response()->json([
        'message' => 'Category updated successfully.',
        'categorie' => $categorie,
    ]);
}

// Delete a category
public function destroyCategorie($id)
{
    $categorie = Categorie::findOrFail($id);

    // Check if any courses are using this category
    $coursesCount = Cours::where('categorie_id', $id)->count();

    if ($coursesCount > 0) {
        return response()->json([
            'message' => 'Cannot delete category. It is associated with ' . $coursesCount . ' course(s).',
        ], 409); // Conflict status code
    }

    // Delete the category image if it exists
    if ($categorie->image && Storage::disk('public')->exists($categorie->image)) {
        Storage::disk('public')->delete($categorie->image);
    }

    $categorie->delete();

    return response()->json([
        'message' => 'Category deleted successfully.'
    ]);
}

 public function showCategorie($id)
{
    $categorie = Categorie::withCount('cours')->find($id);

    if (! $categorie) {
        return response()->json([
            'message' => 'Category not found.'
        ], 404);
    }

    // Prefix image URL if needed
    if ($categorie->image) {
        $categorie->image = asset('storage/' . $categorie->image);
    }

    return response()->json([
        'categorie' => $categorie
    ]);
}





    // Add these methods to your InstructorCourseController class

    // Get sections for a specific course
    public function getSections($courseId)
    {
        $instructeur = Auth::user()->instructeur;

        $cours = Cours::where('id', $courseId)
            ->where('instructeur_id', $instructeur->id)
            ->first();

        if (!$cours) {
            return response()->json([
                'message' => 'Course not found or you do not have permission'
            ], 404);
        }

        $sections = $cours->sections()->with('lecons')->orderBy('ordre')->get();

        return response()->json([
            'sections' => $sections
        ]);
    }

    // Create a new section
    public function storeSection(Request $request, $courseId)
    {
        $request->validate([
            'titre' => 'required|string|max:255',
            'ordre' => 'nullable|integer|min:0',
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

        $data = $request->all();
        $data['cours_id'] = $courseId;

        // If no order provided, place at the end
        if (!isset($data['ordre'])) {
            $lastOrder = $cours->sections()->max('ordre') ?? 0;
            $data['ordre'] = $lastOrder + 1;
        }

        $section = Section::create($data);

        return response()->json([
            'message' => 'Section created successfully',
            'section' => $section
        ], 201);
    }

    // Update a section
    public function updateSection(Request $request, $courseId, $sectionId)
    {
        $request->validate([
            'titre' => 'sometimes|required|string|max:255',
            'ordre' => 'sometimes|required|integer|min:0',
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

        $section = Section::where('id', $sectionId)
            ->where('cours_id', $courseId)
            ->first();

        if (!$section) {
            return response()->json([
                'message' => 'Section not found or does not belong to this course'
            ], 404);
        }

        $section->update($request->all());

        return response()->json([
            'message' => 'Section updated successfully',
            'section' => $section
        ]);
    }

    // Delete a section
    public function destroySection($courseId, $sectionId)
    {
        $instructeur = Auth::user()->instructeur;

        $cours = Cours::where('id', $courseId)
            ->where('instructeur_id', $instructeur->id)
            ->first();

        if (!$cours) {
            return response()->json([
                'message' => 'Course not found or you do not have permission'
            ], 404);
        }

        $section = Section::where('id', $sectionId)
            ->where('cours_id', $courseId)
            ->first();

        if (!$section) {
            return response()->json([
                'message' => 'Section not found or does not belong to this course'
            ], 404);
        }

        // Check if section has lessons before deleting
        $lessonsCount = $section->lecons()->count();
        if ($lessonsCount > 0) {
            return response()->json([
                'message' => 'Cannot delete section. It contains ' . $lessonsCount . ' lesson(s).'
            ], 409);
        }

        $section->delete();

        return response()->json([
            'message' => 'Section deleted successfully'
        ]);
    }

    // Reorder sections
    public function reorderSections(Request $request, $courseId)
    {
        $request->validate([
            'sections' => 'required|array',
            'sections.*.id' => 'required|exists:sections,id',
            'sections.*.ordre' => 'required|integer|min:0',
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

        foreach ($request->sections as $sectionData) {
            $section = Section::where('id', $sectionData['id'])
                ->where('cours_id', $courseId)
                ->first();

            if ($section) {
                $section->ordre = $sectionData['ordre'];
                $section->save();
            }
        }

        return response()->json([
            'message' => 'Sections reordered successfully'
        ]);
    }

    public function storeLecon(Request $request, $sectionId)
    {
        $request->validate([
            'titre' => 'required|string|max:255',
            'ordre' => 'nullable|integer|min:0',
            'estGratuite' => 'boolean',
        ]);

        $section = Section::findOrFail($sectionId);

        // Verify instructor owns this section
        $instructeur = Auth::user()->instructeur;
        if ($section->cours->instructeur_id !== $instructeur->id) {
            return response()->json([
                'message' => 'You do not have permission to add lessons to this section'
            ], 403);
        }

        $data = $request->all();
        $data['section_id'] = $sectionId;

        // If no order provided, place at the end
        if (!isset($data['ordre'])) {
            $lastOrder = $section->lecons()->max('ordre') ?? 0;
            $data['ordre'] = $lastOrder + 1;
        }

        $lecon = Lecon::create($data);

        return response()->json([
            'message' => 'Lesson created successfully',
            'lesson' => $lecon
        ], 201);
    }

    public function storeVideo(Request $request, $lessonId)
    {
        $request->validate([
            'video' => 'required|file|mimes:mp4,webm,mov|max:500000', // 500MB max
            'titre' => 'required|string|max:255',
            'dureeMinutes' => 'required|integer|min:1',
        ]);

        $lecon = Lecon::findOrFail($lessonId);

        if ($request->hasFile('video')) {
            $videoFile = $request->file('video');

            // Generate unique filename
            $filename = uniqid() . '_' . time() . '.' . $videoFile->getClientOriginalExtension();
            $path = 'uploads/videos/' . $filename;

            // Create directory if it doesn't exist
            if (!Storage::disk('public')->exists('uploads/videos')) {
                Storage::disk('public')->makeDirectory('uploads/videos');
            }

            // Use streams to handle large files
            $source = fopen($videoFile->getRealPath(), 'rb');
            $destination = Storage::disk('public')->putStream($path, $source);

            if (is_resource($source)) {
                fclose($source);
            }

            if ($destination) {
                $video = $lecon->video()->create([
                    'titre' => $request->titre,
                    'url' => asset('storage/' . $path),
                    'dureeMinutes' => $request->dureeMinutes,
                ]);

                return response()->json([
                    'message' => 'Video uploaded successfully',
                    'video' => $video
                ], 201);
            }
        }

        return response()->json([
            'message' => 'No video file provided or upload failed'
        ], 400);
    }

    public function getLessons($sectionId)
    {
        $section = Section::findOrFail($sectionId);

        // Verify instructor owns this section
        $instructeur = Auth::user()->instructeur;
        if ($section->cours->instructeur_id !== $instructeur->id) {
            return response()->json([
                'message' => 'You do not have permission to view these lessons'
            ], 403);
        }

        $lessons = $section->lecons()->with('video')->orderBy('ordre')->get();

        return response()->json([
            'lessons' => $lessons
        ]);
    }

    public function updateLecon(Request $request, $sectionId, $lessonId)
    {
        $request->validate([
            'titre' => 'required|string|max:255',
            'ordre' => 'nullable|integer|min:0',
            'estGratuite' => 'boolean',
        ]);

        $section = Section::findOrFail($sectionId);
        $lecon = Lecon::where('id', $lessonId)
            ->where('section_id', $sectionId)
            ->first();

        if (!$lecon) {
            return response()->json([
                'message' => 'Lesson not found or does not belong to this section'
            ], 404);
        }

        // Verify instructor owns this section
        $instructeur = Auth::user()->instructeur;
        if ($section->cours->instructeur_id !== $instructeur->id) {
            return response()->json([
                'message' => 'You do not have permission to update lessons in this section'
            ], 403);
        }

        $lecon->update($request->all());

        return response()->json([
            'message' => 'Lesson updated successfully',
            'lesson' => $lecon
        ]);
    }

    public function destroyLecon($sectionId, $lessonId)
    {
        $section = Section::findOrFail($sectionId);
        $lecon = Lecon::where('id', $lessonId)
            ->where('section_id', $sectionId)
            ->first();

        if (!$lecon) {
            return response()->json([
                'message' => 'Lesson not found or does not belong to this section'
            ], 404);
        }

        // Verify instructor owns this section
        $instructeur = Auth::user()->instructeur;
        if ($section->cours->instructeur_id !== $instructeur->id) {
            return response()->json([
                'message' => 'You do not have permission to delete lessons from this section'
            ], 403);
        }

        // Delete associated video if exists
        if ($lecon->video) {
            Storage::disk('public')->delete($lecon->video->url);
            $lecon->video->delete();
        }

        $lecon->delete();

        return response()->json([
            'message' => 'Lesson deleted successfully'
        ]);
    }


// Add these methods to your InstructorCourseController class

// Initialize video upload
public function initVideoUpload(Request $request, $lessonId)
{
    $request->validate([
        'filename' => 'required|string',
        'totalSize' => 'required|integer',
        'titre' => 'required|string',
        'dureeMinutes' => 'required|integer',
    ]);

    $lecon = Lecon::findOrFail($lessonId);

    // Verify instructor owns this lesson
    $instructeur = Auth::user()->instructeur;
    if ($lecon->section->cours->instructeur_id !== $instructeur->id) {
        return response()->json([
            'message' => 'You do not have permission to upload videos to this lesson'
        ], 403);
    }

    // Generate unique upload ID
    $uploadId = uniqid('upload_', true);

    // Create a temp directory for this upload
    $uploadDir = storage_path('app/temp/uploads/' . $uploadId);
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    // Store upload info in a JSON file
    $uploadInfo = [
        'lessonId' => $lessonId,
        'filename' => $request->filename,
        'totalSize' => $request->totalSize,
        'titre' => $request->titre,
        'dureeMinutes' => $request->dureeMinutes,
        'uploadedChunks' => 0,
        'completed' => false,
    ];

    file_put_contents($uploadDir . '/info.json', json_encode($uploadInfo));

    return response()->json([
        'uploadId' => $uploadId,
        'message' => 'Upload initialized successfully'
    ]);
}

// Handle chunk upload
public function uploadVideoChunk(Request $request, $lessonId)
{
    $request->validate([
        'uploadId' => 'required|string',
        'chunkIndex' => 'required|integer',
        'totalChunks' => 'required|integer',
        'chunk' => 'required|file',
    ]);

    $uploadId = $request->uploadId;
    $chunkIndex = $request->chunkIndex;

    // Verify upload exists
    $uploadDir = storage_path('app/temp/uploads/' . $uploadId);
    if (!file_exists($uploadDir) || !file_exists($uploadDir . '/info.json')) {
        return response()->json([
            'message' => 'Upload not found or expired'
        ], 404);
    }

    // Get upload info
    $uploadInfo = json_decode(file_get_contents($uploadDir . '/info.json'), true);

    // Verify this lesson belongs to the instructor
    $lecon = Lecon::findOrFail($lessonId);
    $instructeur = Auth::user()->instructeur;
    if ($lecon->section->cours->instructeur_id !== $instructeur->id) {
        return response()->json([
            'message' => 'You do not have permission to upload videos to this lesson'
        ], 403);
    }

    // Save the chunk
    $chunkFile = $uploadDir . '/chunk_' . $chunkIndex;
    $request->file('chunk')->move(dirname($chunkFile), basename($chunkFile));

    // Update upload info
    $uploadInfo['uploadedChunks']++;
    file_put_contents($uploadDir . '/info.json', json_encode($uploadInfo));

    return response()->json([
        'message' => 'Chunk uploaded successfully',
        'chunkIndex' => $chunkIndex,
        'uploadedChunks' => $uploadInfo['uploadedChunks']
    ]);
}

// Complete video upload
public function completeVideoUpload(Request $request, $lessonId)
{
    try {
        $request->validate([
            'uploadId' => 'required|string',
            'filename' => 'required|string',
        ]);

        $uploadId = $request->uploadId;

        // Verify upload exists
        $uploadDir = storage_path('app/temp/uploads/' . $uploadId);
        if (!file_exists($uploadDir) || !file_exists($uploadDir . '/info.json')) {
            return response()->json([
                'message' => 'Upload not found or expired'
            ], 404);
        }

        // Get upload info
        $uploadInfo = json_decode(file_get_contents($uploadDir . '/info.json'), true);

        // Verify this lesson belongs to the instructor
        $lecon = Lecon::findOrFail($lessonId);
        $instructeur = Auth::user()->instructeur;
        if ($lecon->section->cours->instructeur_id !== $instructeur->id) {
            return response()->json([
                'message' => 'You do not have permission to upload videos to this lesson'
            ], 403);
        }

        // Create final video directory: storage/app/public/uploads/{lessonId}/
        $finalPath = 'uploads/' . $lessonId;
        $finalDir = storage_path('app/public/' . $finalPath);
        if (!file_exists($finalDir)) {
            mkdir($finalDir, 0777, true);
        }

        // Generate final filename
        $finalFilename = time() . '_' . pathinfo($uploadInfo['filename'], PATHINFO_FILENAME) . '.mp4';
        $finalFile = $finalDir . '/' . $finalFilename;
        $publicPath = $finalPath . '/' . $finalFilename;

        // Get all chunk files
        $chunkFiles = glob($uploadDir . '/chunk_*');
        if (empty($chunkFiles)) {
            throw new \Exception('No chunk files found');
        }

        // Sort chunks numerically
        $uploadDirCopy = $uploadDir; // Create a copy for the closure
        usort($chunkFiles, function ($a, $b) use ($uploadDirCopy) {
            return (int)str_replace($uploadDirCopy . '/chunk_', '', $a) -
                   (int)str_replace($uploadDirCopy . '/chunk_', '', $b);
        });

        // Merge chunks
        $outFile = fopen($finalFile, 'wb');
        if (!$outFile) {
            throw new \Exception('Could not create final video file');
        }

        foreach ($chunkFiles as $chunk) {
            $inFile = fopen($chunk, 'rb');
            if (!$inFile) {
                fclose($outFile);
                throw new \Exception('Could not read chunk file: ' . $chunk);
            }
            while ($buffer = fread($inFile, 4096)) {
                fwrite($outFile, $buffer);
            }
            fclose($inFile);
        }
        fclose($outFile);

        // Create or update video record
        $video = $lecon->video()->updateOrCreate(
            ['lecon_id' => $lessonId],
            [
                'titre' => $uploadInfo['titre'],
                'url' => asset('storage/' . $publicPath),
                'dureeMinutes' => $uploadInfo['dureeMinutes'],
            ]
        );

        // Clean up temp files
        array_map('unlink', glob($uploadDir . '/*'));
        rmdir($uploadDir);

        return response()->json([
            'message' => 'Video uploaded successfully',
            'video' => [
                'id' => $video->id,
                'titre' => $video->titre,
                'dureeMinutes' => $video->dureeMinutes,
                'url' => $video->url,
            ]
        ]);

    } catch (\Exception $e) {
        \Log::error('Video upload failed: ' . $e->getMessage());
        return response()->json([
            'message' => 'Failed to complete video upload: ' . $e->getMessage()
        ], 500);
    }
}
}
