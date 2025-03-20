const workoutForm = document.getElementById('workout-form');
const workoutNameInput = document.getElementById('workout-name');
const caloriesBurnedInput = document.getElementById('calories-burned');
const workoutsList = document.getElementById('workouts');
const totalCaloriesDisplay = document.getElementById('total-calories');

let workouts = []; 
let totalCalories = 0; 

let caloriesChart;

document.addEventListener('DOMContentLoaded', () => {
    loadWorkouts(); 
    initChart(); 
    updateTotalCalories(); 
});

workoutForm.addEventListener('submit', function(event) {
    event.preventDefault(); 
    addWorkout(); 
    workoutForm.reset(); 
});

function loadWorkouts() {
    const storedWorkouts = localStorage.getItem('workouts'); 
    if (storedWorkouts) {
        workouts = JSON.parse(storedWorkouts); 
        workouts.forEach(workout => displayWorkout(workout)); 
        updateTotalCalories(); 
    }
}

function saveWorkouts() {
    localStorage.setItem('workouts', JSON.stringify(workouts)); 
}

function addWorkout() {
    const workoutName = workoutNameInput.value.trim(); 
    const caloriesBurned = parseInt(caloriesBurnedInput.value.trim()); 
    
    if (workoutName === '' || isNaN(caloriesBurned) || caloriesBurned <= 0) {
        alert('Please enter valid workout details.');
        return; 
    }

    const workout = {
        id: Date.now(), 
        name: workoutName, 
        calories: caloriesBurned 
    };

    workouts.push(workout);
    displayWorkout(workout); 
    updateTotalCalories(); 
    saveWorkouts(); 
    updateChart(); 
}

function displayWorkout(workout) {
    const li = document.createElement('li'); 
    li.dataset.id = workout.id; 

    li.innerHTML = `
        <span>${workout.name}</span>
        <span>${workout.calories} Calories</span>
        <button class="delete-btn">&times;</button>
    `;

    li.querySelector('.delete-btn').addEventListener('click', function() {
        deleteWorkout(workout.id); 
    });
    workoutsList.appendChild(li); 
}

function deleteWorkout(id) {
    workouts = workouts.filter(workout => workout.id !== id); 
    const workoutItem = workoutsList.querySelector(`[data-id='${id}']`); 
    if (workoutItem) {
        workoutsList.removeChild(workoutItem); // Remove from DOM
    }
    updateTotalCalories(); 
    saveWorkouts(); 
    updateChart(); 
}

function updateTotalCalories() {
    totalCalories = workouts.reduce((total, workout) => total + workout.calories, 0);
    totalCaloriesDisplay.textContent = totalCalories; // Update DOM
}


function initChart() {
    const ctx = document.getElementById('caloriesChart').getContext('2d');
    caloriesChart = new Chart(ctx, {
        type: 'bar', // Bar chart type
        data: {
            labels: workouts.map(workout => workout.name), // Workout names as labels
            datasets: [{
                label: 'Calories Burned',
                data: workouts.map(workout => workout.calories), 
                backgroundColor: 'rgba(39, 174, 96, 0.6)', // Bar color
                borderColor: 'rgba(39, 174, 96, 1)', // Bar border color
                borderWidth: 1
            }]
        },
        options: {
            responsive: true, // Responsive for different screen sizes
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Workout' // X-axis label
                    }
                },
                y: {
                    beginAtZero: true, // Y-axis starts at zero
                    title: {
                        display: true,
                        text: 'Calories Burned' // Y-axis label
                    }
                }
            }
        }
    });
}
// Update the chart with new data
function updateChart() {
    caloriesChart.data.labels = workouts.map(workout => workout.name); 
    caloriesChart.data.datasets[0].data = workouts.map(workout => workout.calories); 
    caloriesChart.update(); 
}