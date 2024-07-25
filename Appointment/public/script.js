const calendar = document.getElementById('calendar');
const timeSlots = document.getElementById('timeSlots');
const currentMonthElement = document.getElementById('currentMonth');
const prevMonthButton = document.getElementById('prevMonth');
const nextMonthButton = document.getElementById('nextMonth');
const selectedDateTimeElement = document.getElementById('selectedDateTime');
const bookingForm = document.getElementById('bookingForm');
const confirmationMessage = document.getElementById('confirmationMessage');
const cancelButton = document.getElementById('cancelButton');

let currentDate = new Date(2024, 6, 24); 
let selectedDate = null;
let selectedTime = null;

function generateCalendar(date) {
    calendar.innerHTML = '';
    const year = date.getFullYear();
    const month = date.getMonth();

    currentMonthElement.textContent = `${date.toLocaleString('default', { month: 'long' })} ${year}`;

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    days.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.textContent = day;
        dayElement.classList.add('calendar-day');
        calendar.appendChild(dayElement);
    });

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    for (let i = 0; i < firstDay.getDay(); i++) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('calendar-day');
        dayElement.classList.add('not-current-month');
        calendar.appendChild(dayElement);
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
        const dayElement = document.createElement('div');
        dayElement.textContent = i;
        dayElement.classList.add('calendar-day');
        dayElement.classList.add('current-month');
        if (i === date.getDate() && !selectedDate) {
            dayElement.classList.add('selected');
            selectedDate = new Date(year, month, i);
        }
        dayElement.addEventListener('click', () => selectDate(new Date(year, month, i)));
        calendar.appendChild(dayElement);
    }

    const remainingDays = 42 - (firstDay.getDay() + lastDay.getDate());
    for (let i = 1; i <= remainingDays; i++) {
        const dayElement = document.createElement('div');
        dayElement.textContent = i;
        dayElement.classList.add('calendar-day');
        dayElement.classList.add('not-current-month');
        calendar.appendChild(dayElement);
    }
}

function generateTimeSlots() {
    const slots = ['2:45 pm', '3:15 pm', '3:45 pm', '4:15 pm', '4:45 pm', '5:15 pm', '5:45 pm'];
    timeSlots.innerHTML = '';
    slots.forEach(slot => {
        const slotElement = document.createElement('div');
        slotElement.textContent = slot;
        slotElement.classList.add('time-slot');
        slotElement.addEventListener('click', () => selectTime(slot));
        timeSlots.appendChild(slotElement);
    });
}

function selectDate(date) {
    selectedDate = date;
    const calendarDays = document.querySelectorAll('.calendar-day');
    calendarDays.forEach(day => day.classList.remove('selected'));
    const selectedDay = Array.from(calendarDays).find(day => day.textContent == date.getDate() && day.classList.contains('current-month'));
    if (selectedDay) selectedDay.classList.add('selected');
    updateSelectedDateTime();
}

function selectTime(time) {
    selectedTime = time;
    const timeSlotElements = document.querySelectorAll('.time-slot');
    timeSlotElements.forEach(slot => slot.classList.remove('selected'));
    const selectedSlot = Array.from(timeSlotElements).find(slot => slot.textContent === time);
    if (selectedSlot) selectedSlot.classList.add('selected');
    updateSelectedDateTime();
}

function updateSelectedDateTime() {
    if (selectedDate && selectedTime) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        selectedDateTimeElement.textContent = `${selectedDate.toLocaleDateString('default', options)} at ${selectedTime}`;
        document.getElementById('date').value = selectedDate.toISOString().split('T')[0];
        document.getElementById('time').value = selectedTime;
    } else {
        selectedDateTimeElement.textContent = '';
    }
}

prevMonthButton.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    generateCalendar(currentDate);
});
nextMonthButton.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    generateCalendar(currentDate);
});

bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (selectedDate && selectedTime) {
        const formData = new FormData(bookingForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            notes: formData.get('notes'),
            date: formData.get('date'),
            time: formData.get('time'),
        };

        const response = await fetch('/book', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const message = await response.text();
        confirmationMessage.textContent = message;
        confirmationMessage.style.display = 'block';
    } else {
        confirmationMessage.textContent = 'Please select a date and time.';
        confirmationMessage.style.display = 'block';
    }
});

cancelButton.addEventListener('click', () => {
    selectedDate = null;
    selectedTime = null;
    selectedDateTimeElement.textContent = '';
    confirmationMessage.style.display = 'none';
    bookingForm.reset();
    const calendarDays = document.querySelectorAll('.calendar-day');
    calendarDays.forEach(day => day.classList.remove('selected'));
    const timeSlotElements = document.querySelectorAll('.time-slot');
    timeSlotElements.forEach(slot => slot.classList.remove('selected'));
});

generateCalendar(currentDate);
generateTimeSlots();
