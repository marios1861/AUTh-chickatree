from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from .models import Tree
from .serializers import TreeSerializer


# Create your views here.
@api_view(['GET', 'POST '])
def trees_list(request):
    if request.method == 'GET':
        data = Tree.objects.all()

        serializer = TreeSerializer(data, context={'request': request}, many=True)

        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = TreeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT', 'DELETE'])
def tree_detail(request, pk):
    try:
        tree = Tree.objects.get(pk=pk)
    except Tree.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializer = TreeSerializer(tree, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        tree.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
