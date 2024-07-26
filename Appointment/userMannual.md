## User Manual for Calendar Booking System

## Table of Contents
    1. Introduction
    2. System Requirements
    3. Installation
    4. Usage
    5. Accessing the Application
    6. Booking an Appointment
    7. Navigating the Calendar
    8. Selecting a Time Slot
    9. Submitting the Booking Form
    10. Viewing the Confirmation Message
    11. Canceling a Booking
    12. Using the Back Button
    13. FAQ
    14. Troubleshooting
    15. Contact Information

1. Introduction
    Welcome to the Calendar Booking System. This manual provides step-by-step instructions on how to use the application to schedule appointments.

2. System Requirements
    A modern web browser (e.g., Chrome, Firefox, Safari)
    Internet connection
    Node.js and npm installed on the server for running the application

3. Installation
    
    Clone the repository:

    bash
    Copy code
    git clone <repository_url>
    cd <repository_directory>
    Install dependencies:

    bash
    Copy code
    npm install
    Configure PostgreSQL database:

    Create a database named meeting_scheduler.
    Update the database connection settings in server.js with your PostgreSQL credentials.
    Start the server:

    bash
    Copy code
    node server.js

4. Usage
    Accessing the Application
    Open your web browser and navigate to http://localhost:3000.

    Booking an Appointment
    Navigate to the Booking Page:

    Open the booking page in your web browser.
    Navigating the Calendar:

    Previous Month: Click the "Previous Month" button to view the previous month's calendar.
    Next Month: Click the "Next Month" button to view the next month's calendar.
    Select Date: Click on a day in the calendar to select the desired date.
    Selecting a Time Slot:

    Available time slots for the selected date will be displayed below the calendar.
    Click on a time slot to select it.
    Submitting the Booking Form:

    Fill out the booking form with the required details: Name, Email, Phone, Notes (optional), and With Whom.
    Click the "Book Appointment" button to submit the form.
    Viewing the Confirmation Message:

    After successfully submitting the form, a confirmation message will be displayed.
    The page will automatically redirect to the main page after 3 seconds.
    Canceling a Booking:

    Click the "Cancel" button to reset the form and clear the selected date and time.
    Using the Back Button:

    Click the "Back" button to return to the previous page.

5. FAQ
Q1: How do I change the available time slots?

Update the generateTimeSlots function in script.js with the desired time slots.
Q2: How do I modify the booking form?

Update the HTML form in index.html with the required fields and IDs.
6. Troubleshooting
Problem: Unable to connect to the database.

Solution: Ensure PostgreSQL is running and the database credentials in server.js are correct.
Problem: Booking confirmation email not sent.

Solution: Ensure the nodemailer configuration in server.js is correct and the email credentials are valid.
7. Contact Information
For further assistance, please contact:

Email: yadavbiplove22@gmail.com
Phone: +977 9816813344 

## This manual provides a comprehensive guide to using the Calendar Booking System. For any additional questions or support, please reach out to the contact information provided.