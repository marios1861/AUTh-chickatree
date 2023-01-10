from django.db import models
from django.contrib.auth.models import User
from django.dispatch import receiver
from django.db.models.signals import post_save
from django_mysql.models import SizedTextField, EnumField


# Create your models here.
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    date_of_birth = models.DateField(null=True)

    class Genders(models.TextChoices):
        MALE = "male"
        FEMALE = "female"
        OTHER = "other"

    gender = models.CharField(max_length=6, choices=Genders.choices)
    country = models.CharField(max_length=45)
    city = models.CharField(max_length=45)
    profile_image = SizedTextField(1, null=True)
    sees_tree = models.ManyToManyField("Tree", related_name="seen_by")
    follower = models.ManyToManyField(
        "self", related_name="followed", symmetrical=False
    )

    def __str__(self):
        return self.user.username


@receiver(post_save, sender=User)
def user_is_created(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
    else:
        instance.profile.save()


def upload_to(instance, filename):
    return "images/{filename}".format(filename=filename)


class Tree(models.Model):
    id = models.AutoField(primary_key=True)
    title = SizedTextField(1)

    owner = models.ForeignKey("Profile", on_delete=models.CASCADE)
    image = models.ImageField(upload_to=upload_to, blank=True, null=True)
    color = models.PositiveIntegerField()

    def __str__(self):
        return self.title


class Note(models.Model):
    id = models.AutoField(primary_key=True)
    tree_id = models.ForeignKey("Tree", on_delete=models.CASCADE)
    parent_id = models.ForeignKey(
        "self", on_delete=models.CASCADE, related_name="child_id", null=True)
    title = SizedTextField(1)
    time_created = models.DateTimeField(auto_now_add=True)
    time_modified = models.DateTimeField(auto_now=True)
    time_viewed = models.DateTimeField(auto_now=True)
    locked = models.BooleanField(default=True)
    hidden = models.BooleanField(default=True)
    image = models.ImageField(upload_to=upload_to, blank=True, null=True)
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

    def __str__(self):
        return self.title


class Published_Tree(models.Model):
    id = models.AutoField(primary_key=True)
    tree_id = models.OneToOneField(
        Tree,
        on_delete=models.CASCADE,
    )
    downloads = models.PositiveIntegerField()
    publish_date = models.DateTimeField(auto_now_add=True)
    description = SizedTextField(3)
    rating = models.FloatField()
    reviews = models.ManyToManyField(Profile, through="Review")

    def __str__(self):
        return self.tree_id.title


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
            models.CheckConstraint(check=models.Q(rating__lte=5), name="rating_lte_5"),
        ]

    def __str__(self):
        return f"{self.author}:{self.rating}"


class Change(models.Model):
    id = models.AutoField(primary_key=True)
    note_id = models.ForeignKey(Note, on_delete=models.CASCADE)
    author = models.ForeignKey(Profile, on_delete=models.SET_DEFAULT, default=-1)
    difference = SizedTextField(3)
    time = models.DateTimeField(auto_now_add=True)
    message = SizedTextField(1)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["id", "note_id"], name="change_pk"),
        ]

    def __str__(self):
        return f"{self.author}:{self.time}"


class Bookmark(models.Model):
    user = models.ForeignKey(Profile, on_delete=models.CASCADE)
    note_id = models.ForeignKey(Note, on_delete=models.CASCADE)
    category = models.CharField(max_length=45)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["user", "note_id"], name="bookmark_pk"),
        ]

    def __str__(self):
        return f"{self.user}:{self.note_id}"


class Comment(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(Profile, on_delete=models.CASCADE)
    note_id = models.ForeignKey(Note, on_delete=models.CASCADE)
    comment = SizedTextField(1)
    start = models.PositiveIntegerField()
    end = models.PositiveIntegerField()
    suggestion = SizedTextField(3)

    def __str__(self):
        return f"{self.user}:{self.note_id}"


class Multimedia(models.Model):
    id = models.AutoField(primary_key=True)
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

    def __str__(self):
        return self.name
