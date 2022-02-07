import sys
import cmath

basicCheap = float(input('basicCheap:'))
stableCheap = float(input('stableCheap:'))

basicExpensive = float(input('basicExpensive:'))
stableExpensive = float(input('stableExpensive:'))

f1 = float(input('F1:'))
f2 = float(input('F2:'))

x = -(
    (basicCheap * basicExpensive * stableCheap * f2 + 2 * basicExpensive**2 *
     stableCheap * f2 + basicCheap * basicExpensive * f1 * stableCheap * f2 +
     basicCheap * basicExpensive * stableCheap * f2**2 + basicExpensive**2 *
     stableCheap * f2**2 + basicCheap**2 * f1 * stableCheap * f2**2 +
     basicCheap * basicExpensive * f1 * stableCheap * f2**2) /
    (3 * (basicCheap * basicExpensive * f2**2 + basicExpensive**2 * f2**2 +
          basicCheap**2 * f1 * f2**2 + basicCheap * basicExpensive * f1 * f2**2))
) - (
    2**(1 / 3) *
    (3 * (basicExpensive**2 * stableCheap**2 + basicCheap * basicExpensive *
          stableCheap**2 * f2 + 2 * basicExpensive**2 * stableCheap**2 * f2 +
          basicCheap * basicExpensive * f1 * stableCheap**2 * f2 -
          basicCheap * basicExpensive * stableCheap * stableExpensive * f2) *
     (basicCheap * basicExpensive * f2**2 + basicExpensive**2 * f2**2 +
      basicCheap**2 * f1 * f2**2 + basicCheap * basicExpensive * f1 * f2**2) -
     (basicCheap * basicExpensive * stableCheap * f2 + 2 * basicExpensive**2 *
      stableCheap * f2 + basicCheap * basicExpensive * f1 * stableCheap * f2 +
      basicCheap * basicExpensive * stableCheap * f2**2 + basicExpensive**2 *
      stableCheap * f2**2 + basicCheap**2 * f1 * stableCheap * f2**2 +
      basicCheap * basicExpensive * f1 * stableCheap * f2**2)**2)
) / (
    3 *
    (basicCheap * basicExpensive * f2**2 + basicExpensive**2 * f2**2
     + basicCheap**2 * f1 * f2**2 + basicCheap * basicExpensive * f1 * f2**2) *
    (-2 * basicCheap**3 * basicExpensive**3 * stableCheap**3 * f2**3 -
     3 * basicCheap**2 * basicExpensive**4 * stableCheap**3 * f2**3 +
     3 * basicCheap * basicExpensive**5 * stableCheap**3 * f2**3 +
     2 * basicExpensive**6 * stableCheap**3 * f2**3 +
     3 * basicCheap**3 * basicExpensive**3 * f1 * stableCheap**3 * f2**3 +
     12 * basicCheap**2 * basicExpensive**4 * f1 * stableCheap**3 * f2**3 +
     3 * basicCheap * basicExpensive**5 * f1 * stableCheap**3 * f2**3 +
     3 * basicCheap**3 * basicExpensive**3 * f1**2 * stableCheap**3 * f2**3 -
     3 * basicCheap**2 * basicExpensive**4 * f1**2 * stableCheap**3 * f2**3 -
     2 * basicCheap**3 * basicExpensive**3 * f1**3 * stableCheap**3 * f2**3 +
     3 * basicCheap**3 * basicExpensive**3 * stableCheap**3 * f2**4 -
     3 * basicCheap**2 * basicExpensive**4 * stableCheap**3 * f2**4 -
     12 * basicCheap * basicExpensive**5 * stableCheap**3 * f2**4 -
     6 * basicExpensive**6 * stableCheap**3 * f2**4 +
     3 * basicCheap**4 * basicExpensive**2 * f1 * stableCheap**3 * f2**4 -
     15 * basicCheap**3 * basicExpensive**3 * f1 * stableCheap**3 * f2**4 -
     30 * basicCheap**2 * basicExpensive**4 * f1 * stableCheap**3 * f2**4 -
     12 * basicCheap * basicExpensive**5 * f1 * stableCheap**3 * f2**4 -
     12 * basicCheap**4 * basicExpensive**2 * f1**2 * stableCheap**3 * f2**4 -
     15 * basicCheap**3 * basicExpensive**3 * f1**2 * stableCheap**3 * f2**4 -
     3 * basicCheap**2 * basicExpensive**4 * f1**2 * stableCheap**3 * f2**4 +
     3 * basicCheap**4 * basicExpensive**2 * f1**3 * stableCheap**3 * f2**4 +
     3 * basicCheap**3 * basicExpensive**3 * f1**3 * stableCheap**3 * f2**4 +
     18 * basicCheap**3 * basicExpensive**3 * stableCheap**2 * stableExpensive
     * f2**4 + 27 * basicCheap**2 * basicExpensive**4 * stableCheap**2 *
     stableExpensive * f2**4 + 9 * basicCheap * basicExpensive**5 * stableCheap
     **2 * stableExpensive * f2**4 + 45 * basicCheap**4 * basicExpensive**2 *
     f1 * stableCheap**2 * stableExpensive * f2**4 + 72 * basicCheap**3 *
     basicExpensive**3 * f1 * stableCheap**2 * stableExpensive * f2**4 + 27 *
     basicCheap**2 * basicExpensive**4 * f1 * stableCheap**2 * stableExpensive
     * f2**4 + 27 * basicCheap**5 * basicExpensive * f1**2 * stableCheap**2 *
     stableExpensive * f2**4 + 45 * basicCheap**4 * basicExpensive**2 * f1**2 *
     stableCheap**2 * stableExpensive * f2**4 + 18 * basicCheap**3 *
     basicExpensive**3 * f1**2 * stableCheap**2 * stableExpensive * f2**4 +
     3 * basicCheap**3 * basicExpensive**3 * stableCheap**3 * f2**5 +
     12 * basicCheap**2 * basicExpensive**4 * stableCheap**3 * f2**5 +
     15 * basicCheap * basicExpensive**5 * stableCheap**3 * f2**5 +
     6 * basicExpensive**6 * stableCheap**3 * f2**5 +
     6 * basicCheap**4 * basicExpensive**2 * f1 * stableCheap**3 * f2**5 +
     27 * basicCheap**3 * basicExpensive**3 * f1 * stableCheap**3 * f2**5 +
     36 * basicCheap**2 * basicExpensive**4 * f1 * stableCheap**3 * f2**5 +
     15 * basicCheap * basicExpensive**5 * f1 * stableCheap**3 * f2**5 +
     3 * basicCheap**5 * basicExpensive * f1**2 * stableCheap**3 * f2**5 +
     18 * basicCheap**4 * basicExpensive**2 * f1**2 * stableCheap**3 * f2**5 +
     27 * basicCheap**3 * basicExpensive**3 * f1**2 * stableCheap**3 * f2**5 +
     12 * basicCheap**2 * basicExpensive**4 * f1**2 * stableCheap**3 * f2**5 +
     3 * basicCheap**5 * basicExpensive * f1**3 * stableCheap**3 * f2**5 +
     6 * basicCheap**4 * basicExpensive**2 * f1**3 * stableCheap**3 * f2**5 +
     3 * basicCheap**3 * basicExpensive**3 * f1**3 * stableCheap**3 * f2**5 -
     9 * basicCheap**3 * basicExpensive**3 * stableCheap**2 * stableExpensive *
     f2**5 - 18 * basicCheap**2 * basicExpensive**4 * stableCheap**2 *
     stableExpensive * f2**5 - 9 * basicCheap * basicExpensive**5 * stableCheap
     **2 * stableExpensive * f2**5 - 18 * basicCheap**4 * basicExpensive**2 *
     f1 * stableCheap**2 * stableExpensive * f2**5 - 36 * basicCheap**3 *
     basicExpensive**3 * f1 * stableCheap**2 * stableExpensive * f2**5 - 18 *
     basicCheap**2 * basicExpensive**4 * f1 * stableCheap**2 * stableExpensive *
     f2**5 - 9 * basicCheap**5 * basicExpensive * f1**2 * stableCheap**2 *
     stableExpensive * f2**5 - 18 * basicCheap**4 * basicExpensive**2 * f1**2 *
     stableCheap**2 * stableExpensive * f2**5 - 9 * basicCheap**3 *
     basicExpensive**3 * f1**2 * stableCheap**2 * stableExpensive * f2**5 -
     2 * basicCheap**3 * basicExpensive**3 * stableCheap**3 * f2**6 -
     6 * basicCheap**2 * basicExpensive**4 * stableCheap**3 * f2**6 -
     6 * basicCheap * basicExpensive**5 * stableCheap**3 * f2**6 -
     2 * basicExpensive**6 * stableCheap**3 * f2**6 -
     6 * basicCheap**4 * basicExpensive**2 * f1 * stableCheap**3 * f2**6 -
     18 * basicCheap**3 * basicExpensive**3 * f1 * stableCheap**3 * f2**6 -
     18 * basicCheap**2 * basicExpensive**4 * f1 * stableCheap**3 * f2**6 -
     6 * basicCheap * basicExpensive**5 * f1 * stableCheap**3 * f2**6 -
     6 * basicCheap**5 * basicExpensive * f1**2 * stableCheap**3 * f2**6 -
     18 * basicCheap**4 * basicExpensive**2 * f1**2 * stableCheap**3 * f2**6 -
     18 * basicCheap**3 * basicExpensive**3 * f1**2 * stableCheap**3 * f2**6 -
     6 * basicCheap**2 * basicExpensive**4 * f1**2 * stableCheap**3 * f2**6 -
     2 * basicCheap**6 * f1**3 * stableCheap**3 * f2**6 - 6 * basicCheap**5 *
     basicExpensive * f1**3 * stableCheap**3 * f2**6 - 6 * basicCheap**4 *
     basicExpensive**2 * f1**3 * stableCheap**3 * f2**6 - 2 * basicCheap**3 *
     basicExpensive**3 * f1**3 * stableCheap**3 * f2**6 + cmath.sqrt(
         (-2 * basicCheap**3 * basicExpensive**3 * stableCheap**3 * f2**3 -
          3 * basicCheap**2 * basicExpensive**4 * stableCheap**3 * f2**3 +
          3 * basicCheap * basicExpensive**5 * stableCheap**3 * f2**3 +
          2 * basicExpensive**6 * stableCheap**3 * f2**3 +
          3 * basicCheap**3 * basicExpensive**3 * f1 * stableCheap**3 * f2**3 +
          12 * basicCheap**2 * basicExpensive**4 * f1 * stableCheap**3 * f2**3 +
          3 * basicCheap * basicExpensive**5 * f1 * stableCheap**3 * f2**3 + 3 *
          basicCheap**3 * basicExpensive**3 * f1**2 * stableCheap**3 * f2**3 -
          3 * basicCheap**2 * basicExpensive**4 * f1**2 * stableCheap**3 * f2**3
          - 2 * basicCheap**3 * basicExpensive**3 * f1**3 * stableCheap**3 *
          f2**3 + 3 * basicCheap**3 * basicExpensive**3 * stableCheap**3 *
          f2**4 - 3 * basicCheap**2 * basicExpensive**4 * stableCheap**3 *
          f2**4 - 12 * basicCheap * basicExpensive**5 * stableCheap**3 * f2**4 -
          6 * basicExpensive**6 * stableCheap**3 * f2**4 +
          3 * basicCheap**4 * basicExpensive**2 * f1 * stableCheap**3 * f2**4 -
          15 * basicCheap**3 * basicExpensive**3 * f1 * stableCheap**3 * f2**4 -
          30 * basicCheap**2 * basicExpensive**4 * f1 * stableCheap**3 * f2**4 -
          12 * basicCheap * basicExpensive**5 * f1 * stableCheap**3 * f2**4 -
          12 * basicCheap**4 * basicExpensive**2 * f1**2 * stableCheap**3 *
          f2**4 - 15 * basicCheap**3 * basicExpensive**3 * f1**2 *
          stableCheap**3 * f2**4 - 3 * basicCheap**2 * basicExpensive**4 *
          f1**2 * stableCheap**3 * f2**4 + 3 * basicCheap**4 *
          basicExpensive**2 * f1**3 * stableCheap**3 * f2**4 + 3 *
          basicCheap**3 * basicExpensive**3 * f1**3 * stableCheap**3 * f2**4 +
          18 * basicCheap**3 * basicExpensive**3 * stableCheap**2 *
          stableExpensive * f2**4 + 27 * basicCheap**2 * basicExpensive**4 *
          stableCheap**2 * stableExpensive * f2**4 + 9 * basicCheap *
          basicExpensive**5 * stableCheap**2 * stableExpensive * f2**4 +
          45 * basicCheap**4 * basicExpensive**2 * f1 * stableCheap**2 *
          stableExpensive * f2**4 + 72 * basicCheap**3 * basicExpensive**3 * f1 *
          stableCheap**2 * stableExpensive * f2**4 + 27 * basicCheap**2 *
          basicExpensive**4 * f1 * stableCheap**2 * stableExpensive * f2**4 +
          27 * basicCheap**5 * basicExpensive * f1**2 * stableCheap**2 *
          stableExpensive * f2**4 + 45 * basicCheap**4 * basicExpensive**2 *
          f1**2 * stableCheap**2 * stableExpensive * f2**4 + 18 * basicCheap**3 *
          basicExpensive**3 * f1**2 * stableCheap**2 * stableExpensive * f2**4 +
          3 * basicCheap**3 * basicExpensive**3 * stableCheap**3 * f2**5 +
          12 * basicCheap**2 * basicExpensive**4 * stableCheap**3 * f2**5 +
          15 * basicCheap * basicExpensive**5 * stableCheap**3 * f2**5 +
          6 * basicExpensive**6 * stableCheap**3 * f2**5 +
          6 * basicCheap**4 * basicExpensive**2 * f1 * stableCheap**3 * f2**5 +
          27 * basicCheap**3 * basicExpensive**3 * f1 * stableCheap**3 * f2**5 +
          36 * basicCheap**2 * basicExpensive**4 * f1 * stableCheap**3 * f2**5 +
          15 * basicCheap * basicExpensive**5 * f1 * stableCheap**3 * f2**5 + 3 *
          basicCheap**5 * basicExpensive * f1**2 * stableCheap**3 * f2**5 + 18 *
          basicCheap**4 * basicExpensive**2 * f1**2 * stableCheap**3 * f2**5 + 27
          * basicCheap**3 * basicExpensive**3 * f1**2 * stableCheap**3 * f2**5 +
          12 * basicCheap**2 * basicExpensive**4 * f1**2 * stableCheap**3 * f2**5
          + 3 * basicCheap**5 * basicExpensive * f1**3 * stableCheap**3 * f2**5 +
          6 * basicCheap**4 * basicExpensive**2 * f1**3 * stableCheap**3 *
          f2**5 + 3 * basicCheap**3 * basicExpensive**3 * f1**3 *
          stableCheap**3 * f2**5 - 9 * basicCheap**3 * basicExpensive**3 *
          stableCheap**2 * stableExpensive * f2**5 - 18 * basicCheap**2 *
          basicExpensive**4 * stableCheap**2 * stableExpensive * f2**5 - 9 *
          basicCheap * basicExpensive**5 * stableCheap**2 * stableExpensive *
          f2**5 - 18 * basicCheap**4 * basicExpensive**2 * f1 * stableCheap**2 *
          stableExpensive * f2**5 - 36 * basicCheap**3 * basicExpensive**3 * f1 *
          stableCheap**2 * stableExpensive * f2**5 - 18 * basicCheap**2 *
          basicExpensive**4 * f1 * stableCheap**2 * stableExpensive * f2**5 -
          9 * basicCheap**5 * basicExpensive * f1**2 * stableCheap**2 *
          stableExpensive * f2**5 - 18 * basicCheap**4 * basicExpensive**2 *
          f1**2 * stableCheap**2 * stableExpensive * f2**5 - 9 * basicCheap**3 *
          basicExpensive**3 * f1**2 * stableCheap**2 * stableExpensive * f2**5 -
          2 * basicCheap**3 * basicExpensive**3 * stableCheap**3 * f2**6 -
          6 * basicCheap**2 * basicExpensive**4 * stableCheap**3 * f2**6 -
          6 * basicCheap * basicExpensive**5 * stableCheap**3 * f2**6 -
          2 * basicExpensive**6 * stableCheap**3 * f2**6 -
          6 * basicCheap**4 * basicExpensive**2 * f1 * stableCheap**3 * f2**6 -
          18 * basicCheap**3 * basicExpensive**3 * f1 * stableCheap**3 * f2**6 -
          18 * basicCheap**2 * basicExpensive**4 * f1 * stableCheap**3 * f2**6 -
          6 * basicCheap * basicExpensive**5 * f1 * stableCheap**3 * f2**6 -
          6 * basicCheap**5 * basicExpensive * f1**2 * stableCheap**3 * f2**6 -
          18 * basicCheap**4 * basicExpensive**2 * f1**2 * stableCheap**3 *
          f2**6 - 18 * basicCheap**3 * basicExpensive**3 * f1**2 *
          stableCheap**3 * f2**6 - 6 * basicCheap**2 * basicExpensive**4 *
          f1**2 * stableCheap**3 * f2**6 - 2 * basicCheap**6 * f1**3 *
          stableCheap**3 * f2**6 - 6 * basicCheap**5 * basicExpensive * f1**3 *
          stableCheap**3 * f2**6 - 6 * basicCheap**4 * basicExpensive**2 *
          f1**3 * stableCheap**3 * f2**6 - 2 * basicCheap**3 *
          basicExpensive**3 * f1**3 * stableCheap**3 * f2**6)**2 + 4 *
         (3 *
          (basicExpensive**2 * stableCheap**2 + basicCheap * basicExpensive *
           stableCheap**2 * f2 + 2 * basicExpensive**2 * stableCheap**2 * f2 +
           basicCheap * basicExpensive * f1 * stableCheap**2 * f2 -
           basicCheap * basicExpensive * stableCheap * stableExpensive * f2) *
          (basicCheap * basicExpensive * f2**2 + basicExpensive**2 * f2**2 +
           basicCheap**2 * f1 * f2**2 + basicCheap * basicExpensive * f1 * f2**2) -
          (basicCheap * basicExpensive * stableCheap * f2 +
           2 * basicExpensive**2 * stableCheap * f2 + basicCheap *
           basicExpensive * f1 * stableCheap * f2 + basicCheap * basicExpensive *
           stableCheap * f2**2 + basicExpensive**2 * stableCheap * f2**2 +
           basicCheap**2 * f1 * stableCheap * f2**2 +
           basicCheap * basicExpensive * f1 * stableCheap * f2**2)**2)**3))**
    (1 / 3)) + (
        1 /
        (3 * 2**(1 / 3) *
         (basicCheap * basicExpensive * f2**2 + basicExpensive**2 * f2**2 +
          basicCheap**2 * f1 * f2**2 + basicCheap * basicExpensive * f1 * f2**2))
    ) * (-2 * basicCheap**3 * basicExpensive**3 * stableCheap**3 * f2**3 -
         3 * basicCheap**2 * basicExpensive**4 * stableCheap**3 * f2**3 +
         3 * basicCheap * basicExpensive**5 * stableCheap**3 * f2**3 +
         2 * basicExpensive**6 * stableCheap**3 * f2**3 +
         3 * basicCheap**3 * basicExpensive**3 * f1 * stableCheap**3 * f2**3 +
         12 * basicCheap**2 * basicExpensive**4 * f1 * stableCheap**3 * f2**3 +
         3 * basicCheap * basicExpensive**5 * f1 * stableCheap**3 * f2**3 +
         3 * basicCheap**3 * basicExpensive**3 * f1**2 * stableCheap**3 * f2**3 -
         3 * basicCheap**2 * basicExpensive**4 * f1**2 * stableCheap**3 * f2**3 -
         2 * basicCheap**3 * basicExpensive**3 * f1**3 * stableCheap**3 * f2**3 +
         3 * basicCheap**3 * basicExpensive**3 * stableCheap**3 * f2**4 -
         3 * basicCheap**2 * basicExpensive**4 * stableCheap**3 * f2**4 -
         12 * basicCheap * basicExpensive**5 * stableCheap**3 * f2**4 -
         6 * basicExpensive**6 * stableCheap**3 * f2**4 +
         3 * basicCheap**4 * basicExpensive**2 * f1 * stableCheap**3 * f2**4 -
         15 * basicCheap**3 * basicExpensive**3 * f1 * stableCheap**3 * f2**4 -
         30 * basicCheap**2 * basicExpensive**4 * f1 * stableCheap**3 * f2**4 -
         12 * basicCheap * basicExpensive**5 * f1 * stableCheap**3 * f2**4 - 12 *
         basicCheap**4 * basicExpensive**2 * f1**2 * stableCheap**3 * f2**4 - 15
         * basicCheap**3 * basicExpensive**3 * f1**2 * stableCheap**3 * f2**4 -
         3 * basicCheap**2 * basicExpensive**4 * f1**2 * stableCheap**3 * f2**4 +
         3 * basicCheap**4 * basicExpensive**2 * f1**3 * stableCheap**3 * f2**4 +
         3 * basicCheap**3 * basicExpensive**3 * f1**3 * stableCheap**3 * f2**4 +
         18 * basicCheap**3 * basicExpensive**3 * stableCheap**2 *
         stableExpensive * f2**4 + 27 * basicCheap**2 * basicExpensive**4 *
         stableCheap**2 * stableExpensive * f2**4 + 9 * basicCheap *
         basicExpensive**5 * stableCheap**2 * stableExpensive * f2**4 +
         45 * basicCheap**4 * basicExpensive**2 * f1 * stableCheap**2 *
         stableExpensive * f2**4 + 72 * basicCheap**3 * basicExpensive**3 * f1 *
         stableCheap**2 * stableExpensive * f2**4 + 27 * basicCheap**2 *
         basicExpensive**4 * f1 * stableCheap**2 * stableExpensive * f2**4 +
         27 * basicCheap**5 * basicExpensive * f1**2 * stableCheap**2 *
         stableExpensive * f2**4 + 45 * basicCheap**4 * basicExpensive**2 *
         f1**2 * stableCheap**2 * stableExpensive * f2**4 + 18 * basicCheap**3 *
         basicExpensive**3 * f1**2 * stableCheap**2 * stableExpensive * f2**4 +
         3 * basicCheap**3 * basicExpensive**3 * stableCheap**3 * f2**5 +
         12 * basicCheap**2 * basicExpensive**4 * stableCheap**3 * f2**5 +
         15 * basicCheap * basicExpensive**5 * stableCheap**3 * f2**5 +
         6 * basicExpensive**6 * stableCheap**3 * f2**5 +
         6 * basicCheap**4 * basicExpensive**2 * f1 * stableCheap**3 * f2**5 +
         27 * basicCheap**3 * basicExpensive**3 * f1 * stableCheap**3 * f2**5 +
         36 * basicCheap**2 * basicExpensive**4 * f1 * stableCheap**3 * f2**5 +
         15 * basicCheap * basicExpensive**5 * f1 * stableCheap**3 * f2**5 + 3 *
         basicCheap**5 * basicExpensive * f1**2 * stableCheap**3 * f2**5 + 18 *
         basicCheap**4 * basicExpensive**2 * f1**2 * stableCheap**3 * f2**5 + 27
         * basicCheap**3 * basicExpensive**3 * f1**2 * stableCheap**3 * f2**5 +
         12 * basicCheap**2 * basicExpensive**4 * f1**2 * stableCheap**3 * f2**5
         + 3 * basicCheap**5 * basicExpensive * f1**3 * stableCheap**3 * f2**5 +
         6 * basicCheap**4 * basicExpensive**2 * f1**3 * stableCheap**3 * f2**5 +
         3 * basicCheap**3 * basicExpensive**3 * f1**3 * stableCheap**3 * f2**5 -
         9 * basicCheap**3 * basicExpensive**3 * stableCheap**2 *
         stableExpensive * f2**5 - 18 * basicCheap**2 * basicExpensive**4 *
         stableCheap**2 * stableExpensive * f2**5 - 9 * basicCheap *
         basicExpensive**5 * stableCheap**2 * stableExpensive * f2**5 -
         18 * basicCheap**4 * basicExpensive**2 * f1 * stableCheap**2 *
         stableExpensive * f2**5 - 36 * basicCheap**3 * basicExpensive**3 * f1 *
         stableCheap**2 * stableExpensive * f2**5 - 18 * basicCheap**2 *
         basicExpensive**4 * f1 * stableCheap**2 * stableExpensive * f2**5 -
         9 * basicCheap**5 * basicExpensive * f1**2 * stableCheap**2 *
         stableExpensive * f2**5 - 18 * basicCheap**4 * basicExpensive**2 *
         f1**2 * stableCheap**2 * stableExpensive * f2**5 - 9 * basicCheap**3 *
         basicExpensive**3 * f1**2 * stableCheap**2 * stableExpensive * f2**5 -
         2 * basicCheap**3 * basicExpensive**3 * stableCheap**3 * f2**6 -
         6 * basicCheap**2 * basicExpensive**4 * stableCheap**3 * f2**6 -
         6 * basicCheap * basicExpensive**5 * stableCheap**3 * f2**6 -
         2 * basicExpensive**6 * stableCheap**3 * f2**6 -
         6 * basicCheap**4 * basicExpensive**2 * f1 * stableCheap**3 * f2**6 -
         18 * basicCheap**3 * basicExpensive**3 * f1 * stableCheap**3 * f2**6 -
         18 * basicCheap**2 * basicExpensive**4 * f1 * stableCheap**3 * f2**6 -
         6 * basicCheap * basicExpensive**5 * f1 * stableCheap**3 * f2**6 -
         6 * basicCheap**5 * basicExpensive * f1**2 * stableCheap**3 * f2**6 -
         18 * basicCheap**4 * basicExpensive**2 * f1**2 * stableCheap**3 * f2**6
         - 18 * basicCheap**3 * basicExpensive**3 * f1**2 * stableCheap**3 *
         f2**6 - 6 * basicCheap**2 * basicExpensive**4 * f1**2 * stableCheap**3 *
         f2**6 - 2 * basicCheap**6 * f1**3 * stableCheap**3 * f2**6 -
         6 * basicCheap**5 * basicExpensive * f1**3 * stableCheap**3 * f2**6 -
         6 * basicCheap**4 * basicExpensive**2 * f1**3 * stableCheap**3 * f2**6 -
         2 * basicCheap**3 * basicExpensive**3 * f1**3 * stableCheap**3 * f2**6 +
         cmath.sqrt(
             (-2 * basicCheap**3 * basicExpensive**3 * stableCheap**3 * f2**3 -
              3 * basicCheap**2 * basicExpensive**4 * stableCheap**3 * f2**3 +
              3 * basicCheap * basicExpensive**5 * stableCheap**3 * f2**3 + 2 *
              basicExpensive**6 * stableCheap**3 * f2**3 + 3 * basicCheap**3 *
              basicExpensive**3 * f1 * stableCheap**3 * f2**3 + 12 *
              basicCheap**2 * basicExpensive**4 * f1 * stableCheap**3 * f2**3 +
              3 * basicCheap * basicExpensive**5 * f1 * stableCheap**3 * f2**3 +
              3 * basicCheap**3 * basicExpensive**3 * f1**2 * stableCheap**3 *
              f2**3 - 3 * basicCheap**2 * basicExpensive**4 * f1**2 *
              stableCheap**3 * f2**3 - 2 * basicCheap**3 * basicExpensive**3 *
              f1**3 * stableCheap**3 * f2**3 +
              3 * basicCheap**3 * basicExpensive**3 * stableCheap**3 * f2**4 -
              3 * basicCheap**2 * basicExpensive**4 * stableCheap**3 * f2**4 -
              12 * basicCheap * basicExpensive**5 * stableCheap**3 * f2**4 - 6 *
              basicExpensive**6 * stableCheap**3 * f2**4 + 3 * basicCheap**4 *
              basicExpensive**2 * f1 * stableCheap**3 * f2**4 - 15 * basicCheap**
              3 * basicExpensive**3 * f1 * stableCheap**3 * f2**4 - 30 *
              basicCheap**2 * basicExpensive**4 * f1 * stableCheap**3 * f2**4 -
              12 * basicCheap * basicExpensive**5 * f1 * stableCheap**3 * f2**4 -
              12 * basicCheap**4 * basicExpensive**2 * f1**2 * stableCheap**3 *
              f2**4 - 15 * basicCheap**3 * basicExpensive**3 * f1**2 *
              stableCheap**3 * f2**4 - 3 * basicCheap**2 * basicExpensive**4 *
              f1**2 * stableCheap**3 * f2**4 + 3 * basicCheap**4 *
              basicExpensive**2 * f1**3 * stableCheap**3 * f2**4 +
              3 * basicCheap**3 * basicExpensive**3 * f1**3 * stableCheap**3 *
              f2**4 + 18 * basicCheap**3 * basicExpensive**3 * stableCheap**2 *
              stableExpensive * f2**4 + 27 * basicCheap**2 * basicExpensive**4 *
              stableCheap**2 * stableExpensive * f2**4 + 9 * basicCheap *
              basicExpensive**5 * stableCheap**2 * stableExpensive * f2**4 +
              45 * basicCheap**4 * basicExpensive**2 * f1 * stableCheap**2 *
              stableExpensive * f2**4 + 72 * basicCheap**3 * basicExpensive**3 *
              f1 * stableCheap**2 * stableExpensive * f2**4 +
              27 * basicCheap**2 * basicExpensive**4 * f1 * stableCheap**2 *
              stableExpensive * f2**4 + 27 * basicCheap**5 * basicExpensive *
              f1**2 * stableCheap**2 * stableExpensive * f2**4 +
              45 * basicCheap**4 * basicExpensive**2 * f1**2 * stableCheap**2 *
              stableExpensive * f2**4 + 18 * basicCheap**3 * basicExpensive**3 *
              f1**2 * stableCheap**2 * stableExpensive * f2**4 +
              3 * basicCheap**3 * basicExpensive**3 * stableCheap**3 * f2**5 +
              12 * basicCheap**2 * basicExpensive**4 * stableCheap**3 * f2**5 +
              15 * basicCheap * basicExpensive**5 * stableCheap**3 * f2**5 + 6 *
              basicExpensive**6 * stableCheap**3 * f2**5 + 6 * basicCheap**4 *
              basicExpensive**2 * f1 * stableCheap**3 * f2**5 + 27 * basicCheap**
              3 * basicExpensive**3 * f1 * stableCheap**3 * f2**5 + 36 *
              basicCheap**2 * basicExpensive**4 * f1 * stableCheap**3 * f2**5 +
              15 * basicCheap * basicExpensive**5 * f1 * stableCheap**3 * f2**5 +
              3 * basicCheap**5 * basicExpensive * f1**2 * stableCheap**3 *
              f2**5 + 18 * basicCheap**4 * basicExpensive**2 * f1**2 *
              stableCheap**3 * f2**5 + 27 * basicCheap**3 * basicExpensive**3 *
              f1**2 * stableCheap**3 * f2**5 + 12 * basicCheap**2 *
              basicExpensive**4 * f1**2 * stableCheap**3 * f2**5 + 3 *
              basicCheap**5 * basicExpensive * f1**3 * stableCheap**3 * f2**5 +
              6 * basicCheap**4 * basicExpensive**2 * f1**3 * stableCheap**3 *
              f2**5 + 3 * basicCheap**3 * basicExpensive**3 * f1**3 *
              stableCheap**3 * f2**5 - 9 * basicCheap**3 * basicExpensive**3 *
              stableCheap**2 * stableExpensive * f2**5 - 18 * basicCheap**2 *
              basicExpensive**4 * stableCheap**2 * stableExpensive * f2**5 -
              9 * basicCheap * basicExpensive**5 * stableCheap**2 *
              stableExpensive * f2**5 - 18 * basicCheap**4 * basicExpensive**2 *
              f1 * stableCheap**2 * stableExpensive * f2**5 -
              36 * basicCheap**3 * basicExpensive**3 * f1 * stableCheap**2 *
              stableExpensive * f2**5 - 18 * basicCheap**2 * basicExpensive**4 *
              f1 * stableCheap**2 * stableExpensive * f2**5 - 9 * basicCheap**5 *
              basicExpensive * f1**2 * stableCheap**2 * stableExpensive * f2**5 -
              18 * basicCheap**4 * basicExpensive**2 * f1**2 * stableCheap**2 *
              stableExpensive * f2**5 - 9 * basicCheap**3 * basicExpensive**3 *
              f1**2 * stableCheap**2 * stableExpensive * f2**5 -
              2 * basicCheap**3 * basicExpensive**3 * stableCheap**3 * f2**6 -
              6 * basicCheap**2 * basicExpensive**4 * stableCheap**3 * f2**6 -
              6 * basicCheap * basicExpensive**5 * stableCheap**3 * f2**6 - 2 *
              basicExpensive**6 * stableCheap**3 * f2**6 - 6 * basicCheap**4 *
              basicExpensive**2 * f1 * stableCheap**3 * f2**6 - 18 *
              basicCheap**3 * basicExpensive**3 * f1 * stableCheap**3 * f2**6 -
              18 * basicCheap**2 * basicExpensive**4 * f1 * stableCheap**3 *
              f2**6 - 6 * basicCheap * basicExpensive**5 * f1 * stableCheap**3 *
              f2**6 - 6 * basicCheap**5 * basicExpensive * f1**2 *
              stableCheap**3 * f2**6 - 18 * basicCheap**4 * basicExpensive**2 *
              f1**2 * stableCheap**3 * f2**6 - 18 * basicCheap**3 *
              basicExpensive**3 * f1**2 * stableCheap**3 * f2**6 -
              6 * basicCheap**2 * basicExpensive**4 * f1**2 * stableCheap**3 *
              f2**6 - 2 * basicCheap**6 * f1**3 * stableCheap**3 * f2**6 - 6 *
              basicCheap**5 * basicExpensive * f1**3 * stableCheap**3 * f2**6 -
              6 * basicCheap**4 * basicExpensive**2 * f1**3 * stableCheap**3 *
              f2**6 - 2 * basicCheap**3 * basicExpensive**3 * f1**3 *
              stableCheap**3 * f2**6)**2 + 4 *
             (3 * (basicExpensive**2 * stableCheap**2 +
                   basicCheap * basicExpensive * stableCheap**2 * f2 +
                   2 * basicExpensive**2 * stableCheap**2 * f2 + basicCheap *
                   basicExpensive * f1 * stableCheap**2 * f2 - basicCheap *
                   basicExpensive * stableCheap * stableExpensive * f2) *
              (basicCheap * basicExpensive * f2**2 + basicExpensive**2 * f2**2 +
               basicCheap**2 * f1 * f2**2 +
               basicCheap * basicExpensive * f1 * f2**2) -
              (basicCheap * basicExpensive * stableCheap * f2 +
               2 * basicExpensive**2 * stableCheap * f2 +
               basicCheap * basicExpensive * f1 * stableCheap * f2 + basicCheap *
               basicExpensive * stableCheap * f2**2 + basicExpensive**2 *
               stableCheap * f2**2 + basicCheap**2 * f1 * stableCheap * f2**2 +
               basicCheap * basicExpensive * f1 * stableCheap * f2**2)**2)**3)
         )**(1 / 3)

print(x.real)

