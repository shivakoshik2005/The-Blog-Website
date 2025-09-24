from django.db import models

class Author(models.Model):
    name = models.CharField(max_length=100)
    course = models.CharField(max_length=100)
    year = models.IntegerField()
    profile_picture = models.ImageField(upload_to='profile_pics/', null=True, blank=True)

    def __str__(self):
        return self.name

class Blog(models.Model):
    title = models.CharField(max_length=200)
    content = models.JSONField()
    author = models.ForeignKey(Author, on_delete=models.CASCADE, related_name='blogs')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title