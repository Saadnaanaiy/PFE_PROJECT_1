<?php
// For public channels, we don't need to define authorization rules
// Public channels are accessible to everyone without authentication

// If you want to switch back to private channels later, uncomment this code:
/*
Broadcast::channel('discussion.{discussionId}', function ($user, $discussionId) {
    // Logic to determine if the user is authorized to listen to this discussion
    $discussion = \App\Models\Discussion::find($discussionId);

    // Example: Check if the user is part of this discussion
    // You might need to adjust this based on your application logic
    return $discussion && ($discussion->user_id === $user->id ||
                          $discussion->forum->cours->hasParticipant($user->id));
});
*/
