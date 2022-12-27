from django.db import models
from django_mysql.models import SizedTextField, EnumField


# Create your models here.
class User(models.Model):
    username = models.CharField(max_length=20, primary_key=True)
    password = models.CharField(max_length=45)

    first_name = models.CharField(max_length=45)
    last_name = models.CharField(max_length=45)

    email = models.EmailField()
    date_of_birth = models.DateTimeField()

    class Genders(models.TextChoices):
        MALE = "male"
        FEMALE = "female"
        OTHER = "other"

    gender = EnumField(choices=Genders.choices)
    country = models.CharField(max_length=45)
    city = models.CharField(max_length=45)
    profile_image = SizedTextField(1)
    sees_tree = models.ManyToManyField('Tree')


class Tree(models.Model):
    id = models.PositiveIntegerField(primary_key=True)
    title = SizedTextField(1)

    owner = models.ForeignKey('User', on_delete=models.CASCADE)
    image = SizedTextField(1)
    color = models.PositiveIntegerField()


class Note(models.Model):
    id = models.PositiveIntegerField(primary_key=True)
    tree_id = models.ForeignKey('Tree', on_delete=models.CASCADE)
    parent_id = models.ForeignKey('self', on_delete=models.CASCADE)
    title = SizedTextField(1)
    time_created = models.DateTimeField(auto_now_add=True)
    time_modified = models.DateTimeField(auto_now=True)
    time_viewed = models.DateTimeField()
    locked = models.BooleanField(default=True)
    hidden = models.BooleanField(default=True)
    image = SizedTextField(1)
    color = models.PositiveIntegerField()
    markdown_text = SizedTextField(3)

    references = models.ManyToManyField('self', related_name='referenced_by', symmetrical=False)
