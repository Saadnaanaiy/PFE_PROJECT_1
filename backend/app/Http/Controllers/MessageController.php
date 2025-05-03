<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\Discussion;
use App\Events\NewMessageEvent;
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
}
