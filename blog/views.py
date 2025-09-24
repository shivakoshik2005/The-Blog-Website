from django.shortcuts import render, redirect, get_object_or_404
from .models import Author, Blog
def blog_list(request):
    blogs = Blog.objects.all()
    return render(request, 'blog/blog_list.html', {'blogs': blogs})

def blog_detail(request, pk):
    blog = get_object_or_404(Blog, pk=pk)
    return render(request, 'blog/blog_detail.html', {'blog': blog})



def add_blog(request):
    if request.method == 'POST':
        # Create Author
        author = Author.objects.create(
            name=request.POST.get('name'),
            course=request.POST.get('course'),
            year=request.POST.get('year'),
            profile_picture=request.FILES.get('profile_picture')
        )

        # Process content blocks
        content = []
        subheadings = request.POST.getlist('content_subheading[]')
        paragraphs = request.POST.getlist('content_paragraph[]')

        # Combine headings and paragraphs together
        for i in range(max(len(subheadings), len(paragraphs))):
            # Add subheading if available
            if i < len(subheadings) and subheadings[i]:
                content.append({
                    'type': 'subheading',
                    'value': subheadings[i]
                })
            # Add corresponding paragraph if available
            if i < len(paragraphs) and paragraphs[i]:
                content.append({
                    'type': 'paragraph',
                    'value': paragraphs[i]
                })

        # Create Blog
        Blog.objects.create(
            author=author,
            title=request.POST.get('title'),
            content=content
        )
        return redirect('blog:blog_list')

    return render(request, 'blog/add_blog.html')