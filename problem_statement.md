K. Connect the Dots
time limit per test
1 second
memory limit per test
1024 mebibytes
input
standard input
output
standard output

Consider N
different points on the Ox axis, numbered 1,2,…,N from left to right. Each point has a color: the color of point i is Ai

.

You want to draw several curves, each curve connecting two points. However, there are the following restrictions.

    Two points of the same color cannot be connected.
    Each curve connecting the points must be above the x-axis. In other words, each interior point of each curve has y>0

. (Endpoints have y=0

    .)
    Two different curves cannot have a common interior point. (It is possible to share endpoints.) 

For example, if there are 4 points as shown below, points 1 and 2 are red, and points 3 and 4 are blue, you can draw a total of 3 curves: between points 1 and 4, 2 and 3, 2 and 4.

Drawing 4 curves would violate at least one of the three restrictions above, so 3 is the maximum in this case.

Given the color of each point, find a way to draw as many curves connecting two points as possible without violating any restrictions, and print which two points each curve connects.
Input

The first line contains an integer T
, the number of test cases (1≤T≤101

). The test cases follow.

The first line of each test case has the number of points N
and the number of colors M (2≤N≤200000, 2≤M≤N

).

The next line contains N
integers A1,A2,…,AN (1≤Ai≤M

).

The sum of N
over all test cases does not exceed 200000

.
Output

For each test case, start with a line containing an integer K

: the maximum number of curves connecting two points.

In each of the next K

lines, print the indices of the two points connected by a curve. The curves must satisfy all the restrictions above. If there are several possible answers, print any one of them.
Example