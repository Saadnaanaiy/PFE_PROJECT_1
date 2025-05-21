<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cours;
use App\Models\Categorie;
use App\Models\User;
use App\Models\Instructeur;

class ChatbotController extends Controller
{
    /**
     * Process a chatbot query and return a response
     */
    public function processQuery(Request $request)
    {
        $request->validate([
            'query' => 'required|string',
        ]);

        $query = strtolower($request->input('query'));
        $response = $this->generateResponse($query);

        return response()->json([
            'response' => $response,
        ]);
    }

    /**
     * Generate a response based on the query
     */
    private function generateResponse($query)
    {
        // Course-related queries
        if (str_contains($query, 'course') || str_contains($query, 'cours')) {
            if (str_contains($query, 'how many') || str_contains($query, 'combien')) {
                $count = Cours::count();
                return "We currently offer {$count} courses on our platform.";
            }
            
            if (str_contains($query, 'popular') || str_contains($query, 'populaire')) {
                $popularCourses = Cours::orderBy('etudiants_count', 'desc')->take(3)->get();
                $response = "Our most popular courses are: ";
                foreach ($popularCourses as $index => $course) {
                    $response .= ($index + 1) . ". {$course->titre}";
                    if ($index < count($popularCourses) - 1) {
                        $response .= ", ";
                    }
                }
                return $response;
            }
        }
        
        // Category-related queries
        if (str_contains($query, 'categor')) {
            $categories = Categorie::all();
            $response = "We offer courses in the following categories: ";
            foreach ($categories as $index => $category) {
                $response .= $category->nom;
                if ($index < count($categories) - 1) {
                    $response .= ", ";
                }
            }
            return $response;
        }
        
        // Instructor-related queries
        if (str_contains($query, 'instructor') || str_contains($query, 'teacher') || str_contains($query, 'professeur')) {
            $count = Instructeur::count();
            return "We have {$count} qualified instructors on our platform.";
        }
        
        // Platform-related queries
        if (str_contains($query, 'about') || str_contains($query, 'platform') || str_contains($query, 'website')) {
            return "Marocademy is a Moroccan e-learning platform offering high-quality courses in various fields. Our mission is to make education accessible to everyone in Morocco and beyond.";
        }
        
        // Payment-related queries
        if (str_contains($query, 'payment') || str_contains($query, 'pay') || str_contains($query, 'prix') || str_contains($query, 'cost')) {
            return "We accept various payment methods including credit cards and bank transfers. Course prices vary, with many starting from 199 MAD.";
        }
        
        // Default response for unrecognized queries
        return "I'm your Marocademy assistant. I can help you with information about our courses, instructors, and platform. Feel free to ask me anything!";
    }
}
