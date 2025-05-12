<?php
// For public channels, we don't need to define authorization rules
// Public channels are accessible to everyone without authentication

use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('cart.{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $userId;
});

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

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('cart.{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $userId;
});

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
