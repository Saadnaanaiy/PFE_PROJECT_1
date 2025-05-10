<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class UserTypingEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $discussion_id;
    public $user_id;
    public $user_name;
    public $is_typing;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct($discussion_id, $user_id, $user_name, $is_typing)
    {
        $this->discussion_id = $discussion_id;
        $this->user_id = $user_id;
        $this->user_name = $user_name;
        $this->is_typing = $is_typing;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new Channel('discussion.' . $this->discussion_id);
    }
}
