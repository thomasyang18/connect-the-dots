# Freebie Connections

Freebie connections are automatically added edges between adjacent vertices that have different colors. These connections are considered "free" because they do not count against the maximum number of user-defined edges.

## Rules

1. **Adjacent Vertices**: Freebie connections are only added between adjacent vertices. For a vertex `i`, the adjacent vertex is `(i + 1) % n`.
2. **Different Colors**: Freebie connections are only added if the colors of the adjacent vertices are different.
3. **No User Interference**: Freebie connections cannot be removed or modified by the user. They are automatically managed by the game.
4. **Visual Representation**: Freebie connections are drawn as solid lines.

## Purpose

The purpose of freebie connections is to provide the player with a set of automatically added edges that help them achieve the goal of the game. By ensuring that adjacent vertices with different colors are connected, the game makes it easier for the player to focus on connecting vertices of the same color without worrying about the initial setup.

## Implementation

Freebie connections are generated and managed within the `Polygon` class. The `generateFreebieConnections` method is responsible for creating the list of freebie connections based on the current state of the polygon.

## Example

Given a polygon with 6 vertices and 3 colors, the freebie connections might look like this:

- Vertex 0 (color 0) -> Vertex 1 (color 1) -> Freebie connection
- Vertex 1 (color 1) -> Vertex 2 (color 2) -> Freebie connection
- Vertex 2 (color 2) -> Vertex 3 (color 0) -> Freebie connection
- Vertex 3 (color 0) -> Vertex 4 (color 1) -> Freebie connection
- Vertex 4 (color 1) -> Vertex 5 (color 2) -> Freebie connection
- Vertex 5 (color 2) -> Vertex 0 (color 0) -> Freebie connection

In this example, freebie connections are added between vertices 0-1, 1-2, 2-3, 3-4, 4-5, and 5-0 because their colors are different.
