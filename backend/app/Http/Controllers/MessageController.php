<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\Discussion;
use App\Events\NewMessageEvent;
use App\Events\UserTypingEvent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class MessageController extends Controller
{
    /**
     * Display a listing of messages for a discussion.
     *
     * @param  int  $discussionId
     * @return \Illuminate\Http\Response
     */
    public function index($discussionId)
    {
        $discussion = Discussion::findOrFail($discussionId);

        $messages = Message::with('user')
            ->where('discussion_id', $discussionId)
            ->orderBy('dateEnvoi', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $messages
        ]);
    }

    /**
     * Store a newly created message in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $discussionId
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, $discussionId)
    {
        $validator = Validator::make($request->all(), [
            'contenu' => 'required|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $discussion = Discussion::findOrFail($discussionId);

        $message = new Message();
        $message->contenu = $request->contenu;
        $message->dateEnvoi = now();
        $message->discussion_id = $discussionId;
        $message->user_id = Auth::id();
        $message->save();

        // Load the user relationship
        $message->load('user');

        // Broadcast the event
        broadcast(new NewMessageEvent($message))->toOthers();

        return response()->json([
            'success' => true,
            'message' => 'Message sent successfully',
            'data' => $message
        ]);
    }
    
    /**
     * Handle user typing indicator.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $discussionId
     * @return \Illuminate\Http\Response
     */
    public function typing(Request $request, $discussionId)
    {
        $validator = Validator::make($request->all(), [
            'is_typing' => 'required|boolean',
        ]);
        

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $discussion = Discussion::findOrFail($discussionId);
        $user = Auth::user();
        $isTyping = $request->is_typing;
        
        // Get user's full name
        $userName = $user->prenom . ' ' . $user->nom;
        
        // Broadcast typing event
        broadcast(new UserTypingEvent($discussionId, $user->id, $userName, $isTyping))->toOthers();
        
        return response()->json([
            'success' => true,
            'message' => $isTyping ? 'Typing indicator sent' : 'Typing indicator stopped'
        ]);
    }
}
