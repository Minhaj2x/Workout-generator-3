const workouts = {
    beginner: {
        'weight-loss': ['15 min jog', '10 push-ups', '15 sit-ups'],
        'muscle-gain': ['3 sets of 8 squats', '3 sets of 8 bench press'],
        'endurance': ['20 min cycling', '15 min jump rope'],
        'flexibility': ['30 min yoga', '15 min stretching'],
        'overall-fitness': ['20 min HIIT', '10 min core workout']
    },
    intermediate: {
        'weight-loss': ['20 min jog', '15 push-ups', '20 sit-ups'],
        'muscle-gain': ['4 sets of 10 squats', '4 sets of 10 bench press'],
        'endurance': ['30 min cycling', '20 min jump rope'],
        'flexibility': ['40 min yoga', '20 min stretching'],
        'overall-fitness': ['30 min HIIT', '20 min core workout']
    },
    advanced: {
        'weight-loss': ['30 min jog', '20 push-ups', '30 sit-ups'],
        'muscle-gain': ['5 sets of 8 squats', '5 sets of 8 bench press'],
        'endurance': ['40 min cycling', '30 min jump rope'],
        'flexibility': ['50 min yoga', '30 min stretching'],
        'overall-fitness': ['40 min HIIT', '30 min core workout']
    }
};

document.addEventListener('DOMContentLoaded', function() {
    const elems = document.querySelectorAll('select');
    const instances = M.FormSelect.init(elems);
});

document.getElementById('workout-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Get selected values
    const fitnessLevel = document.getElementById('fitness-level').value;
    const goal = document.getElementById('goal').value;

    // Debugging logs to check values
    console.log("Fitness Level:", fitnessLevel);
    console.log("Goal:", goal);

    if (fitnessLevel && goal) {
        // Retrieve the workout list based on selections
        const workoutList = workouts[fitnessLevel][goal];
        const output = `
            <h3 class="fade-in">Your Workout:</h3>
            <ul class="fade-in">
                ${workoutList.map(workout => `<li>${workout}</li>`).join('')}
            </ul>`;

        // Insert the workout list into the output div
        document.getElementById('workout-output').innerHTML = output;

        // Add fade-in effect
        document.getElementById('workout-output').classList.add('fade-in');
    } else {
        alert('Please select both your fitness level and goal.');
    }
});
