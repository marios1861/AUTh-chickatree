from django.db import models
from django.contrib.auth.models import User
from django.dispatch import receiver
from django.db.models.signals import post_save
from django_mysql.models import SizedTextField, EnumField


# Create your models here.
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    date_of_birth = models.DateTimeField()

    class Genders(models.TextChoices):
        MALE = "male"
        FEMALE = "female"
        OTHER = "other"

    gender = EnumField(choices=Genders.choices)
    country = models.CharField(max_length=45)
    city = models.CharField(max_length=45)
    profile_image = SizedTextField(1)
    sees_tree = models.ManyToManyField("Tree", related_name="seen_by")
    follower = models.ManyToManyField(
        "self", related_name="followed", symmetrical=False
    )


@receiver(post_save, sender=User)
def user_is_created(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
    else:
        instance.profile.save()


class Tree(models.Model):
    id = models.PositiveIntegerField(primary_key=True)
    title = SizedTextField(1)

    owner = models.ForeignKey("Profile", on_delete=models.CASCADE)
    image = SizedTextField(1)
    color = models.PositiveIntegerField()


class Note(models.Model):
    id = models.PositiveIntegerField(primary_key=True)
    tree_id = models.ForeignKey("Tree", on_delete=models.CASCADE)
    parent_id = models.ForeignKey(
        "self", on_delete=models.CASCADE, related_name="child_id"
    )
    title = SizedTextField(1)
    time_created = models.DateTimeField(auto_now_add=True)
    time_modified = models.DateTimeField(auto_now=True)
    time_viewed = models.DateTimeField()
    locked = models.BooleanField(default=True)
    hidden = models.BooleanField(default=True)
    image = SizedTextField(1)
    color = models.PositiveIntegerField()
    markdown_text = SizedTextField(3)

    references = models.ManyToManyField(
        "self", related_name="referenced_by", symmetrical=False
    )
    changes = models.ManyToManyField(
        Profile, related_name="changed_note", through="Change"
    )
    bookmarks = models.ManyToManyField(
        Profile, related_name="bookmarked_note", through="Bookmark"
    )
    comments = models.ManyToManyField(
        Profile, related_name="commented_note", through="Comment"
    )


class Published_Tree(models.Model):
    id = models.PositiveIntegerField(primary_key=True)
    tree_id = models.OneToOneField(
        Tree,
        on_delete=models.CASCADE,
    )
    downloads = models.PositiveIntegerField()
    publish_date = models.DateTimeField(auto_now_add=True)
    description = SizedTextField(3)
    rating = models.FloatField()
    reviews = models.ManyToManyField(Profile, through="Review")


class Review(models.Model):
    author = models.ForeignKey(Profile, on_delete=models.CASCADE)
    published_tree_id = models.ForeignKey(Published_Tree, on_delete=models.CASCADE)
    rating = models.PositiveIntegerField()
    review = SizedTextField(3)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["author", "published_tree_id"], name="review_pk"
            ),
            models.CheckConstraint(check=models.Q(rating__lte=5), name='rating_lte_5')
        ]


class Change(models.Model):
    id = models.PositiveIntegerField(primary_key=True)
    note_id = models.ForeignKey(Note, on_delete=models.CASCADE)
    author = models.ForeignKey(
        Profile, on_delete=models.SET_DEFAULT, default="deleted_user"
    )
    difference = SizedTextField(3)
    time = models.DateTimeField(auto_now_add=True)
    message = SizedTextField(1)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["id", "note_id"], name="change_pk"),
        ]


class Bookmark(models.Model):
    user = models.ForeignKey(Profile, on_delete=models.CASCADE)
    note_id = models.ForeignKey(Note, on_delete=models.CASCADE)
    category = models.CharField(max_length=45)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["user", "note_id"], name="bookmark_pk"),
        ]


class Comment(models.Model):
    id = models.PositiveIntegerField(primary_key=True)
    user = models.ForeignKey(Profile, on_delete=models.CASCADE)
    note_id = models.ForeignKey(Note, on_delete=models.CASCADE)
    comment = SizedTextField(1)
    start = models.PositiveIntegerField()
    end = models.PositiveIntegerField()
    suggestion = SizedTextField(3)


class Multimedia(models.Model):
    id = models.PositiveIntegerField(primary_key=True)
    note_id = models.ForeignKey(Note, on_delete=models.CASCADE)
    name = models.CharField(max_length=45)

    class Types(models.TextChoices):
        VIDEO = "video"
        IMAGE = "image"
        AUDIO = "audio"

    type = EnumField(choices=Types.choices)
    alt_text = SizedTextField(1)
    filename = SizedTextField(1)
    directory = SizedTextField(1)
    extension = models.CharField(max_length=45)
    size = models.FloatField()

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["id", "note_id"], name="multimedia_pk"),
        ]
