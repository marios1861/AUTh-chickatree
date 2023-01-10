from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework import serializers
from .models import (
    Profile,
    Tree,
    Note,
    Published_Tree,
    Review,
    Change,
    Bookmark,
    Comment,
    Multimedia,
)


class CreateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email", "first_name", "last_name", "password")
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            validated_data["username"],
            validated_data["email"],
            validated_data["password"],
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
        )
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email", "first_name", "last_name")


class LoginUserSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Invalid Details.")


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = [
            "user",
            "date_of_birth",
            "gender",
            "country",
            "city",
            "profile_image",
            "follower",
            "sees_tree",
        ]
        extra_kwargs = {
            "profile_image": {"required": False},
            "follower": {"required": False},
            "sees_tree": {"required": False},
        }


class TreeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tree
        fields = [
            "id",
            "title",
            "owner",
            "image",
            "color",
        ]


class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = [
            "id",
            "tree_id",
            "parent_id",
            "title",
            "time_created",
            "time_viewed",
            "time_modified",
            "locked",
            "hidden",
            "image",
            "color",
            "markdown_text",
            "references",
            "changes",
            "bookmarks",
            "comments",
        ]
        extra_kwargs = {
            "references": {"required": False, "allow_empty": True},
            "markdown_text": {"required": False},
            "title": {"required": False},
        }


class PublishedTreeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Published_Tree
        fields = [
            "id",
            "tree_id",
            "downloads",
            "publish_date",
            "description",
            "rating",
            "reviews",
        ]


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = [
            "author",
            "published_tree_id",
            "rating",
            "review",
        ]


class ChangeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Change
        fields = [
            "id",
            "note_id",
            "author",
            "difference",
            "time",
            "message",
        ]


class BookmarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bookmark
        fields = [
            "user",
            "note_id",
            "category",
        ]


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = [
            "id",
            "user",
            "note_id",
            "comment",
            "start",
            "end",
            "suggestion",
        ]


class MultimediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Multimedia
        fields = [
            "id",
            "note_id",
            "name",
            "type",
            "alt_text",
            "filename",
            "directory",
            "extension",
            "size",
        ]
