
Blog Website 📝

A feature-rich and modern blog platform built with Django. This project provides a complete solution for creating, managing, and sharing articles with a clean user interface and a powerful admin panel.

✨ Features

  * *Create, Read, Update, Delete (CRUD)* functionality for blog posts.
  * *Rich Text Editor:* A user-friendly editor for writing and formatting posts.
  * *Responsive Design:* Looks great on desktops, tablets, and mobile devices.

-----

🛠 Technologies Used

  * *Backend:* Python, Django
  * *Database:* SQLite3 (default).
  * *Frontend:* HTML, CSS, JavaScript

------

🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

Prerequisites

Make sure you have the following installed on your system:

  * *Python* (version 3.8 or higher)
  * *Git*

Setup and Installation

Follow these steps to set up the project locally.

1.  *Clone the Repository*
    Open your terminal and clone the project repository using Git.

    sh
    git clone <your-repository-url.git>
    cd blog-website
    

2.  *Create and Activate a Virtual Environment*
    It's highly recommended to use a virtual environment to manage project dependencies.

      * *On macOS/Linux:*
        sh
        python3 -m venv venv
        source venv/bin/activate
        
      * *On Windows:*
        sh
        python -m venv venv
        .\venv\Scripts\activate
        

    Your terminal prompt should now be prefixed with (venv), indicating the virtual environment is active.

3.  *Install Dependencies*
    Install all the required Python packages listed in the requirements.txt file.

    sh
    pip install -r requirements.txt
    

4.  *Apply Database Migrations*
    This command sets up your database schema based on the project's models.

    sh
    python manage.py migrate
    

5.  *Create a Superuser*
    You'll need a superuser account to access the Django admin panel. Follow the prompts to create one.

    sh
    python manage.py createsuperuser
    

6.  *Run the Development Server*
    You're all set\! Start the Django development server.

    sh
    python manage.py runserver
    

    The application will be available at **[http://127.0.0.1:8000/](https://www.google.com/url?sa=E&source=gmail&q=http://127.0.0.1:8000/)**.

-----

## 🖥 Usage

  * Visit http://127.0.0.1:8000/ to view the blog.
  * Access the admin panel by navigating to http://127.0.0.1:8000/admin/ and logging in with the superuser credentials you created. From here, you can manage all aspects of the blog.

-----

## 🤝 Contributing

Contributions, issues, and feature requests are welcome\! Feel free to check the issues page.

1.  Fork the Project
2.  Create your Feature Branch (git checkout -b feature/AmazingFeature)
3.  Commit your Changes (git commit -m 'Add some AmazingFeature')
4.  Push to the Branch (git push origin feature/AmazingFeature)
5.  Open a Pull Request

-----


## 📧 Contact

Your Name - K Shiva Koushik
shivakoushik2005@gmail.com
Get to know me : shivakoshik2005.github.io/portfolio
