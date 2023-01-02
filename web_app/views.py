from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status, viewsets, permissions, generics
from knox.models import AuthToken

from .models import Tree, Note, Published_Tree, Review, Change, Bookmark, Comment, Multimedia
from .serializers import (
    TreeSerializer,
    CreateUserSerializer,
    UserSerializer,
    LoginUserSerializer,
    NoteSerializer,
    PublishedTreeSerializer,
    ReviewSerializer,
    ChangeSerializer,
    BookmarkSerializer,
    CommentSerializer,
    MultimediaSerializer,
)


# Create your views here.


class RegistrationAPI(generics.GenericAPIView):
    serializer_class = CreateUserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {
                "user": UserSerializer(
                    user, context=self.get_serializer_context()
                ).data,
                "token": AuthToken.objects.create(user)[1],
            }
        )


class UserAPI(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated, ]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class LoginAPI(generics.GenericAPIView):
    serializer_class = LoginUserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)[1]
        })


@api_view(["GET", "POST "])
def trees_list(request):
    if request.method == "GET":
        data = Tree.objects.all()
        serializer = TreeSerializer(data, context={"request": request}, many=True)
        return Response(serializer.data)
    elif request.method == "POST":
        serializer = TreeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["PUT", "DELETE"])
def tree_detail(request, pk):
    try:
        tree = Tree.objects.get(pk=pk)
    except Tree.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "PUT":
        serializer = TreeSerializer(
            tree, data=request.data, context={"request": request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == "DELETE":
        tree.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET", "POST "])
def notes_list(request):
    if request.method == "GET":
        data = Note.objects.all()
        serializer = NoteSerializer(data, context={"request": request}, many=True)
        return Response(serializer.data)
    elif request.method == "POST":
        serializer = NoteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["PUT", "DELETE"])
def note_detail(request, pk):
    try:
        note = Note.objects.get(pk=pk)
    except Note.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "PUT":
        serializer = NoteSerializer(
            note, data=request.data, context={"request": request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == "DELETE":
        note.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET", "POST "])
def published_trees_list(request):
    if request.method == "GET":
        data = Published_Tree.objects.all()
        serializer = PublishedTreeSerializer(data, context={"request": request}, many=True)
        return Response(serializer.data)
    elif request.method == "POST":
        serializer = PublishedTreeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["PUT", "DELETE"])
def published_tree_detail(request, pk):
    try:
        published_tree = Published_Tree.objects.get(pk=pk)
    except Published_Tree.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "PUT":
        serializer = PublishedTreeSerializer(
            published_tree, data=request.data, context={"request": request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == "DELETE":
        published_tree.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET", "POST "])
def reviews_list(request):
    if request.method == "GET":
        data = Review.objects.all()
        serializer = ReviewSerializer(data, context={"request": request}, many=True)
        return Response(serializer.data)
    elif request.method == "POST":
        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["PUT", "DELETE"])
def review_detail(request, pk):
    try:
        review = Review.objects.get(pk=pk)
    except Review.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "PUT":
        serializer = ReviewSerializer(
            review, data=request.data, context={"request": request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == "DELETE":
        review.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET", "POST "])
def changes_list(request):
    if request.method == "GET":
        data = Change.objects.all()
        serializer = ChangeSerializer(data, context={"request": request}, many=True)
        return Response(serializer.data)
    elif request.method == "POST":
        serializer = ChangeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["PUT", "DELETE"])
def change_detail(request, pk):
    try:
        change = Change.objects.get(pk=pk)
    except Change.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "PUT":
        serializer = ChangeSerializer(
            change, data=request.data, context={"request": request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == "DELETE":
        change.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET", "POST "])
def bookmarks_list(request):
    if request.method == "GET":
        data = Bookmark.objects.all()
        serializer = BookmarkSerializer(data, context={"request": request}, many=True)
        return Response(serializer.data)
    elif request.method == "POST":
        serializer = BookmarkSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["PUT", "DELETE"])
def bookmark_detail(request, pk):
    try:
        bookmark = Bookmark.objects.get(pk=pk)
    except Bookmark.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "PUT":
        serializer = BookmarkSerializer(
            bookmark, data=request.data, context={"request": request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == "DELETE":
        bookmark.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET", "POST "])
def comments_list(request):
    if request.method == "GET":
        data = Comment.objects.all()
        serializer = CommentSerializer(data, context={"request": request}, many=True)
        return Response(serializer.data)
    elif request.method == "POST":
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["PUT", "DELETE"])
def comment_detail(request, pk):
    try:
        comment = Comment.objects.get(pk=pk)
    except Comment.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "PUT":
        serializer = CommentSerializer(
            comment, data=request.data, context={"request": request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == "DELETE":
        comment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET", "POST "])
def multimedia_list(request):
    if request.method == "GET":
        data = Multimedia.objects.all()
        serializer = MultimediaSerializer(data, context={"request": request}, many=True)
        return Response(serializer.data)
    elif request.method == "POST":
        serializer = MultimediaSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["PUT", "DELETE"])
def multimedia_detail(request, pk):
    try:
        multimedia = Multimedia.objects.get(pk=pk)
    except Multimedia.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "PUT":
        serializer = MultimediaSerializer(
            multimedia, data=request.data, context={"request": request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == "DELETE":
        multimedia.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)