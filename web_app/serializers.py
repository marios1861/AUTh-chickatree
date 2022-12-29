from rest_framework import serializers
from .models import Profile, Tree, Note


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = {
            "id",
            "user.username",
            "user.email",
            "user.first_name",
            "user.last_name",
            "date_of_birth",
            "gender",
            "country",
            "city",
            "profile_image",
            "follower",
            "sees_tree",
        }


class TreeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tree
        fields = {
            "id",
            "title",
            "owner",
            "image",
            "color",
        }


class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = {
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
        }
