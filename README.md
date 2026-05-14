# The Blog Website (Django)

A structured, feature-based blog project built with **Django**. It includes:
- A **Blog list** page
- A **Blog detail** page
- A **Blog creation editor** using **drag & drop content blocks**
- **Author profile picture upload**

Storage is handled by **SQLite** (`db.sqlite3`) using Django’s ORM and migrations.

---

## 1) Entire project structure (full repository layout)

```text
.
├── db.sqlite3
├── manage.py
├── README.md
│
├── artistic_blog/
│   ├── __init__.py
│   ├── asgi.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
│
└── blog/
    ├── __init__.py
    ├── admin.py
    ├── apps.py
    ├── models.py
    ├── tests.py
    ├── urls.py
    ├── views.py
    ├── migrations/
    │   ├── __init__.py
    │   └── 0001_initial.py
    ├── static/
    │   ├── css/
    │   │   ├── create.css
    │   │   └── style.css
    │   └── js/
    │       ├── create.js
    │       ├── main.js
    │       └── rating.js
    └── templates/
        ├── base_template.html
        ├── base.html
        ├── blog_detail.html
        ├── blog_list.html
        ├── list.html
        └── blog/
            ├── add_blog.html
            ├── blog_detail.html
            └── blog_list.html

├── templates/
│   └── base.html
│
├── static/
│   ├── css/
│   │   └── style.css
│   ├── blog/
│   │   ├── css/
│   │   │   └── style.css
│   │   └── js/
│   │       ├── main.js
│   │       └── rating.js
│   └── js/
│       ├── main.js
│       └── rating.js
│
├── staticfiles/              # generated after `python manage.py collectstatic`
│   └── admin/...
│
└── media/
    └── profile_pics/
        ├── image-removebg-preview_-_2025-06-23T212039.049.png
        ├── test.jpg
        ├── test-removebg-preview.png
        └── test_pqy9JcT.jpg
```

### What these folders are used for
- **`artistic_blog/`**: Django *project* (settings, root URL routing, WSGI/ASGI)
- **`blog/`**: Django *app* (models, views, URLs, templates, static)
- **`templates/`**: project-level templates (used by Django template loader)
- **`static/`** and **`blog/static/`**: CSS/JS assets
- **`staticfiles/`**: output directory created by `collectstatic`
- **`media/`**: user-uploaded files (profile pictures)

---

## 2) Tech stack (detailed explanation)

### Backend
- **Python**: core runtime language.
- **Django**: full-stack web framework providing:
  - URL routing (`urls.py`)
  - Request handlers/views (`views.py`)
  - ORM (`models.py`) + migrations
  - Templates (HTML rendering)
  - Admin site
  - Static/media configuration

### Frontend
- **HTML + CSS**: page structure and styling.
- **JavaScript**:
  - Implements the **drag & drop editor** on the blog creation page.
  - Generates the hidden/visible form inputs so the server receives block data.
  - Performs simple client-side validation (e.g., a subheading must be followed by a paragraph).

### Database
- **SQLite 3**:
  - Stored in **one file**: `db.sqlite3`.
  - Used by Django backend: `django.db.backends.sqlite3`.

---

## 3) How the code flows end-to-end (request → routing → views → ORM/DB → templates)

### 3.1 URL routing at the project level
**File:** `artistic_blog/urls.py`

Key routing:
- `path('admin/', admin.site.urls)`
- `path('', include('blog.urls'))`

So:
- `/admin/` is handled by Django’s admin.
- `/` and everything under it (except `/admin/`) is handled by the `blog` app.

In `DEBUG=True`, Django also serves:
- `/media/` from `MEDIA_ROOT`
- `/static/` from `STATIC_ROOT`

---

### 3.2 URL routing at the app level
**File:** `blog/urls.py`

```python
app_name = 'blog'

urlpatterns = [
    path('', views.blog_list, name='blog_list'),
    path('add/', views.add_blog, name='add_blog'),
    path('blog/<int:pk>/', views.blog_detail, name='blog_detail'),
]
```

Routes:
1. **`GET /`** → `blog_list`
2. **`GET /add/`** → `add_blog` (render editor)
3. **`POST /add/`** → `add_blog` (create Author + Blog + JSON content)
4. **`GET /blog/<pk>/`** → `blog_detail`

---

### 3.3 Views (what they do)

#### A) `blog_list(request)`
**File:** `blog/views.py`

- Reads all blog posts:
  - `blogs = Blog.objects.all()`
- Renders:
  - `blog/blog_list.html`
- Passes:
  - `{'blogs': blogs}`

**How templates use it:**
- For each `blog`, the template displays:
  - `blog.title`
  - a snippet of content (template iterates JSON blocks and prints the first paragraph it finds)
  - the related `blog.author` fields (and profile image if present)

---

#### B) `blog_detail(request, pk)`
- Fetches one blog:
  - `blog = get_object_or_404(Blog, pk=pk)`
- Renders:
  - `blog/blog_detail.html`
- Template logic:
  - Iterates `blog.content` (JSON array)
  - When block is `{type: 'subheading'}` → render `<h2>`
  - When block is `{type: 'paragraph'}` → render `<p>` under the related subheading

Because content is stored as JSON blocks, the template “reconstructs” the document structure during rendering.

---

#### C) `add_blog(request)` (GET + POST)

**GET**
- Renders editor page:
  - `blog/add_blog.html`

**POST** (core server-side flow)
1. **Create an Author**
   - Uses form fields:
     - `name`, `course`, `year`
     - optional `profile_picture`
   - Creates the row via:
     - `Author.objects.create(...)`

2. **Build JSON content blocks**
   - The editor (JavaScript) creates repeated inputs named:
     - `content_subheading[]`
     - `content_paragraph[]`
   - Server reads them as lists:
     - `subheadings = request.POST.getlist('content_subheading[]')`
     - `paragraphs = request.POST.getlist('content_paragraph[]')`

3. **Combine subheading + paragraph by index**
   - Loop: `for i in range(max(len(subheadings), len(paragraphs))):`
   - For each index:
     - if a subheading exists → append `{type:'subheading', value: ...}`
     - if a paragraph exists → append `{type:'paragraph', value: ...}`

4. **Create the Blog post**
   - Creates via:
     - `Blog.objects.create(author=author, title=..., content=content)`

5. **Redirect**
   - `return redirect('blog:blog_list')`

---

### 3.4 How the JavaScript editor changes form data
**File:** `blog/templates/blog/add_blog.html`

- The page shows draggable “tools”:
  - Subheading tool
  - Paragraph tool
- When dropped on the canvas, JS creates DOM elements with inputs:
  - `<input name="content_subheading[]" ...>`
  - `<textarea name="content_paragraph[]" ...>`
- On submit, JS validates block ordering:
  - last element must not be a subheading
  - each subheading must be followed by a paragraph

So the server always receives structured input arrays that the Python view can convert into JSON blocks.

---

## 4) Database explanation (models + why SQLite)

### 4.1 Models
**File:** `blog/models.py`

#### `Author`
- `name: CharField(100)`
- `course: CharField(100)`
- `year: IntegerField()`
- `profile_picture: ImageField(upload_to='profile_pics/', null=True, blank=True)`

#### `Blog`
- `title: CharField(200)`
- `content: JSONField()`
- `author: ForeignKey(Author, on_delete=CASCADE, related_name='blogs')`
- `created_at: DateTimeField(auto_now_add=True)`

---

### 4.2 How JSONField works here
`Blog.content` is a JSON array of blocks.

The application assumes a block ordering pattern:
- subheading comes before its paragraph

The template uses each block’s `type` to decide rendering.

---

### 4.3 Why SQLite 3 and not another DB?
This project explicitly sets:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
```

Reasons (practical):
- SQLite requires **no server installation**.
- It’s ideal for:
  - learning
  - demos
  - small projects
- The DB is a single file (`db.sqlite3`), so it’s easy to move and run.

**Trade-off:** it’s not as scalable or feature-rich as PostgreSQL for heavy production workloads.

---

## 5) Django commands used in this project (syntax + meaning + purpose)

Commands are executed from the repo root where `manage.py` exists:

```bash
python manage.py <command>
```

### 5.1 `runserver`
```bash
python manage.py runserver
```
**Purpose:** start the local Django development server.

### 5.2 `migrate`
```bash
python manage.py migrate
```
**Purpose:** apply migration files to the database.
- Creates tables in SQLite.
- Updates schema to match `models.py`.

### 5.3 `makemigrations`
```bash
python manage.py makemigrations
```
**Purpose:** detect model changes and generate migration files.
- Generates files under `blog/migrations/`.

### 5.4 `createsuperuser`
```bash
python manage.py createsuperuser
```
**Purpose:** create a Django admin account.
- Then you can log into `/admin/`.

### 5.5 `shell`
```bash
python manage.py shell
```
**Purpose:** open a Django-aware Python shell.
- Great for testing ORM queries.

### 5.6 `check`
```bash
python manage.py check
```
**Purpose:** run Django’s system checks (settings, URL config, etc.).

### 5.7 `showmigrations`
```bash
python manage.py showmigrations
```
**Purpose:** list migrations and which ones are applied.

### 5.8 `sqlmigrate`
```bash
python manage.py sqlmigrate <app_label> <migration_name>
```
Example:
```bash
python manage.py sqlmigrate blog 0001
```
**Purpose:** show the SQL a migration would run (useful to understand DB changes).

### 5.9 `collectstatic`
```bash
python manage.py collectstatic
```
**Purpose:** copy static files from `static/` and `app/static/` into `STATIC_ROOT` (`staticfiles/`).

---

## 6) How to run the project (complete flow)

### 6.1 Create virtual environment
```bash
python3 -m venv venv
source venv/bin/activate
```

### 6.2 Install dependencies
```bash
pip install -r requirements.txt
```

### 6.3 Apply migrations (SQLite DB)
```bash
python manage.py migrate
```

### 6.4 (Optional) create admin user
```bash
python manage.py createsuperuser
```

### 6.5 Start server
```bash
python manage.py runserver
```

### 6.6 URLs
- Blog list: `http://127.0.0.1:8000/`
- Create blog: `http://127.0.0.1:8000/add/`
- Blog detail: `http://127.0.0.1:8000/blog/<pk>/`
- Admin: `http://127.0.0.1:8000/admin/`

---

## 7) POST /add/ step-by-step (what exactly changes)

1. Browser submits the form.
2. `add_blog` receives:
   - author fields (name/course/year)
   - `profile_picture` file
   - arrays of content:
     - `content_subheading[]` (repeated)
     - `content_paragraph[]` (repeated)
3. Django:
   - saves uploaded image into `media/profile_pics/`
   - creates an `Author` row
   - converts posted arrays into the JSON structure
   - creates a `Blog` row referencing that author
4. Browser is redirected back to `/` and the new post appears.

---

## 8) Notes about “why it is the way it is” (important design choices)

- **Structured blog content is stored in JSON** (`Blog.content`) because the editor allows variable-length blocks.
- **Templates render JSON blocks dynamically** by checking each block’s `type`.
- **JS ensures correct ordering** (heading before paragraph) so the server can build consistent JSON.
- **SQLite** is used for simplicity: minimal setup, single-file DB, easy migrations.

