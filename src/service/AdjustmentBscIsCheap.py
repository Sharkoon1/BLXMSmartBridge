import cmath
import numpy
import math

basicCheap = 15000
stableCheap = 298
basicExpensive = 15001
stableExpensive = 299
P = 0.997
U = 0.998

x = -(
    (basicCheap * basicExpensive * stableCheap * U + 2 * basicExpensive**2 *
     stableCheap * U + basicCheap * basicExpensive * P * stableCheap * U +
     basicCheap * basicExpensive * stableCheap * U**2 + basicExpensive**2 *
     stableCheap * U**2 + basicCheap**2 * P * stableCheap * U**2 +
     basicCheap * basicExpensive * P * stableCheap * U**2) /
    (3 * (basicCheap * basicExpensive * U**2 + basicExpensive**2 * U**2 +
          basicCheap**2 * P * U**2 + basicCheap * basicExpensive * P * U**2))
) - (
    2**(1 / 3) *
    (3 * (basicExpensive**2 * stableCheap**2 + basicCheap * basicExpensive *
          stableCheap**2 * U + 2 * basicExpensive**2 * stableCheap**2 * U +
          basicCheap * basicExpensive * P * stableCheap**2 * U -
          basicCheap * basicExpensive * stableCheap * stableExpensive * U) *
     (basicCheap * basicExpensive * U**2 + basicExpensive**2 * U**2 +
      basicCheap**2 * P * U**2 + basicCheap * basicExpensive * P * U**2) -
     (basicCheap * basicExpensive * stableCheap * U + 2 * basicExpensive**2 *
      stableCheap * U + basicCheap * basicExpensive * P * stableCheap * U +
      basicCheap * basicExpensive * stableCheap * U**2 + basicExpensive**2 *
      stableCheap * U**2 + basicCheap**2 * P * stableCheap * U**2 +
      basicCheap * basicExpensive * P * stableCheap * U**2)**2)
) / (
    3 *
    (basicCheap * basicExpensive * U**2 + basicExpensive**2 * U**2
     + basicCheap**2 * P * U**2 + basicCheap * basicExpensive * P * U**2) *
    (-2 * basicCheap**3 * basicExpensive**3 * stableCheap**3 * U**3 -
     3 * basicCheap**2 * basicExpensive**4 * stableCheap**3 * U**3 +
     3 * basicCheap * basicExpensive**5 * stableCheap**3 * U**3 +
     2 * basicExpensive**6 * stableCheap**3 * U**3 +
     3 * basicCheap**3 * basicExpensive**3 * P * stableCheap**3 * U**3 +
     12 * basicCheap**2 * basicExpensive**4 * P * stableCheap**3 * U**3 +
     3 * basicCheap * basicExpensive**5 * P * stableCheap**3 * U**3 +
     3 * basicCheap**3 * basicExpensive**3 * P**2 * stableCheap**3 * U**3 -
     3 * basicCheap**2 * basicExpensive**4 * P**2 * stableCheap**3 * U**3 -
     2 * basicCheap**3 * basicExpensive**3 * P**3 * stableCheap**3 * U**3 +
     3 * basicCheap**3 * basicExpensive**3 * stableCheap**3 * U**4 -
     3 * basicCheap**2 * basicExpensive**4 * stableCheap**3 * U**4 -
     12 * basicCheap * basicExpensive**5 * stableCheap**3 * U**4 -
     6 * basicExpensive**6 * stableCheap**3 * U**4 +
     3 * basicCheap**4 * basicExpensive**2 * P * stableCheap**3 * U**4 -
     15 * basicCheap**3 * basicExpensive**3 * P * stableCheap**3 * U**4 -
     30 * basicCheap**2 * basicExpensive**4 * P * stableCheap**3 * U**4 -
     12 * basicCheap * basicExpensive**5 * P * stableCheap**3 * U**4 -
     12 * basicCheap**4 * basicExpensive**2 * P**2 * stableCheap**3 * U**4 -
     15 * basicCheap**3 * basicExpensive**3 * P**2 * stableCheap**3 * U**4 -
     3 * basicCheap**2 * basicExpensive**4 * P**2 * stableCheap**3 * U**4 +
     3 * basicCheap**4 * basicExpensive**2 * P**3 * stableCheap**3 * U**4 +
     3 * basicCheap**3 * basicExpensive**3 * P**3 * stableCheap**3 * U**4 +
     18 * basicCheap**3 * basicExpensive**3 * stableCheap**2 * stableExpensive
     * U**4 + 27 * basicCheap**2 * basicExpensive**4 * stableCheap**2 *
     stableExpensive * U**4 + 9 * basicCheap * basicExpensive**5 * stableCheap
     **2 * stableExpensive * U**4 + 45 * basicCheap**4 * basicExpensive**2 *
     P * stableCheap**2 * stableExpensive * U**4 + 72 * basicCheap**3 *
     basicExpensive**3 * P * stableCheap**2 * stableExpensive * U**4 + 27 *
     basicCheap**2 * basicExpensive**4 * P * stableCheap**2 * stableExpensive
     * U**4 + 27 * basicCheap**5 * basicExpensive * P**2 * stableCheap**2 *
     stableExpensive * U**4 + 45 * basicCheap**4 * basicExpensive**2 * P**2 *
     stableCheap**2 * stableExpensive * U**4 + 18 * basicCheap**3 *
     basicExpensive**3 * P**2 * stableCheap**2 * stableExpensive * U**4 +
     3 * basicCheap**3 * basicExpensive**3 * stableCheap**3 * U**5 +
     12 * basicCheap**2 * basicExpensive**4 * stableCheap**3 * U**5 +
     15 * basicCheap * basicExpensive**5 * stableCheap**3 * U**5 +
     6 * basicExpensive**6 * stableCheap**3 * U**5 +
     6 * basicCheap**4 * basicExpensive**2 * P * stableCheap**3 * U**5 +
     27 * basicCheap**3 * basicExpensive**3 * P * stableCheap**3 * U**5 +
     36 * basicCheap**2 * basicExpensive**4 * P * stableCheap**3 * U**5 +
     15 * basicCheap * basicExpensive**5 * P * stableCheap**3 * U**5 +
     3 * basicCheap**5 * basicExpensive * P**2 * stableCheap**3 * U**5 +
     18 * basicCheap**4 * basicExpensive**2 * P**2 * stableCheap**3 * U**5 +
     27 * basicCheap**3 * basicExpensive**3 * P**2 * stableCheap**3 * U**5 +
     12 * basicCheap**2 * basicExpensive**4 * P**2 * stableCheap**3 * U**5 +
     3 * basicCheap**5 * basicExpensive * P**3 * stableCheap**3 * U**5 +
     6 * basicCheap**4 * basicExpensive**2 * P**3 * stableCheap**3 * U**5 +
     3 * basicCheap**3 * basicExpensive**3 * P**3 * stableCheap**3 * U**5 -
     9 * basicCheap**3 * basicExpensive**3 * stableCheap**2 * stableExpensive *
     U**5 - 18 * basicCheap**2 * basicExpensive**4 * stableCheap**2 *
     stableExpensive * U**5 - 9 * basicCheap * basicExpensive**5 * stableCheap
     **2 * stableExpensive * U**5 - 18 * basicCheap**4 * basicExpensive**2 *
     P * stableCheap**2 * stableExpensive * U**5 - 36 * basicCheap**3 *
     basicExpensive**3 * P * stableCheap**2 * stableExpensive * U**5 - 18 *
     basicCheap**2 * basicExpensive**4 * P * stableCheap**2 * stableExpensive *
     U**5 - 9 * basicCheap**5 * basicExpensive * P**2 * stableCheap**2 *
     stableExpensive * U**5 - 18 * basicCheap**4 * basicExpensive**2 * P**2 *
     stableCheap**2 * stableExpensive * U**5 - 9 * basicCheap**3 *
     basicExpensive**3 * P**2 * stableCheap**2 * stableExpensive * U**5 -
     2 * basicCheap**3 * basicExpensive**3 * stableCheap**3 * U**6 -
     6 * basicCheap**2 * basicExpensive**4 * stableCheap**3 * U**6 -
     6 * basicCheap * basicExpensive**5 * stableCheap**3 * U**6 -
     2 * basicExpensive**6 * stableCheap**3 * U**6 -
     6 * basicCheap**4 * basicExpensive**2 * P * stableCheap**3 * U**6 -
     18 * basicCheap**3 * basicExpensive**3 * P * stableCheap**3 * U**6 -
     18 * basicCheap**2 * basicExpensive**4 * P * stableCheap**3 * U**6 -
     6 * basicCheap * basicExpensive**5 * P * stableCheap**3 * U**6 -
     6 * basicCheap**5 * basicExpensive * P**2 * stableCheap**3 * U**6 -
     18 * basicCheap**4 * basicExpensive**2 * P**2 * stableCheap**3 * U**6 -
     18 * basicCheap**3 * basicExpensive**3 * P**2 * stableCheap**3 * U**6 -
     6 * basicCheap**2 * basicExpensive**4 * P**2 * stableCheap**3 * U**6 -
     2 * basicCheap**6 * P**3 * stableCheap**3 * U**6 - 6 * basicCheap**5 *
     basicExpensive * P**3 * stableCheap**3 * U**6 - 6 * basicCheap**4 *
     basicExpensive**2 * P**3 * stableCheap**3 * U**6 - 2 * basicCheap**3 *
     basicExpensive**3 * P**3 * stableCheap**3 * U**6 + cmath.sqrt(
         (-2 * basicCheap**3 * basicExpensive**3 * stableCheap**3 * U**3 -
          3 * basicCheap**2 * basicExpensive**4 * stableCheap**3 * U**3 +
          3 * basicCheap * basicExpensive**5 * stableCheap**3 * U**3 +
          2 * basicExpensive**6 * stableCheap**3 * U**3 +
          3 * basicCheap**3 * basicExpensive**3 * P * stableCheap**3 * U**3 +
          12 * basicCheap**2 * basicExpensive**4 * P * stableCheap**3 * U**3 +
          3 * basicCheap * basicExpensive**5 * P * stableCheap**3 * U**3 + 3 *
          basicCheap**3 * basicExpensive**3 * P**2 * stableCheap**3 * U**3 -
          3 * basicCheap**2 * basicExpensive**4 * P**2 * stableCheap**3 * U**3
          - 2 * basicCheap**3 * basicExpensive**3 * P**3 * stableCheap**3 *
          U**3 + 3 * basicCheap**3 * basicExpensive**3 * stableCheap**3 *
          U**4 - 3 * basicCheap**2 * basicExpensive**4 * stableCheap**3 *
          U**4 - 12 * basicCheap * basicExpensive**5 * stableCheap**3 * U**4 -
          6 * basicExpensive**6 * stableCheap**3 * U**4 +
          3 * basicCheap**4 * basicExpensive**2 * P * stableCheap**3 * U**4 -
          15 * basicCheap**3 * basicExpensive**3 * P * stableCheap**3 * U**4 -
          30 * basicCheap**2 * basicExpensive**4 * P * stableCheap**3 * U**4 -
          12 * basicCheap * basicExpensive**5 * P * stableCheap**3 * U**4 -
          12 * basicCheap**4 * basicExpensive**2 * P**2 * stableCheap**3 *
          U**4 - 15 * basicCheap**3 * basicExpensive**3 * P**2 *
          stableCheap**3 * U**4 - 3 * basicCheap**2 * basicExpensive**4 *
          P**2 * stableCheap**3 * U**4 + 3 * basicCheap**4 *
          basicExpensive**2 * P**3 * stableCheap**3 * U**4 + 3 *
          basicCheap**3 * basicExpensive**3 * P**3 * stableCheap**3 * U**4 +
          18 * basicCheap**3 * basicExpensive**3 * stableCheap**2 *
          stableExpensive * U**4 + 27 * basicCheap**2 * basicExpensive**4 *
          stableCheap**2 * stableExpensive * U**4 + 9 * basicCheap *
          basicExpensive**5 * stableCheap**2 * stableExpensive * U**4 +
          45 * basicCheap**4 * basicExpensive**2 * P * stableCheap**2 *
          stableExpensive * U**4 + 72 * basicCheap**3 * basicExpensive**3 * P *
          stableCheap**2 * stableExpensive * U**4 + 27 * basicCheap**2 *
          basicExpensive**4 * P * stableCheap**2 * stableExpensive * U**4 +
          27 * basicCheap**5 * basicExpensive * P**2 * stableCheap**2 *
          stableExpensive * U**4 + 45 * basicCheap**4 * basicExpensive**2 *
          P**2 * stableCheap**2 * stableExpensive * U**4 + 18 * basicCheap**3 *
          basicExpensive**3 * P**2 * stableCheap**2 * stableExpensive * U**4 +
          3 * basicCheap**3 * basicExpensive**3 * stableCheap**3 * U**5 +
          12 * basicCheap**2 * basicExpensive**4 * stableCheap**3 * U**5 +
          15 * basicCheap * basicExpensive**5 * stableCheap**3 * U**5 +
          6 * basicExpensive**6 * stableCheap**3 * U**5 +
          6 * basicCheap**4 * basicExpensive**2 * P * stableCheap**3 * U**5 +
          27 * basicCheap**3 * basicExpensive**3 * P * stableCheap**3 * U**5 +
          36 * basicCheap**2 * basicExpensive**4 * P * stableCheap**3 * U**5 +
          15 * basicCheap * basicExpensive**5 * P * stableCheap**3 * U**5 + 3 *
          basicCheap**5 * basicExpensive * P**2 * stableCheap**3 * U**5 + 18 *
          basicCheap**4 * basicExpensive**2 * P**2 * stableCheap**3 * U**5 + 27
          * basicCheap**3 * basicExpensive**3 * P**2 * stableCheap**3 * U**5 +
          12 * basicCheap**2 * basicExpensive**4 * P**2 * stableCheap**3 * U**5
          + 3 * basicCheap**5 * basicExpensive * P**3 * stableCheap**3 * U**5 +
          6 * basicCheap**4 * basicExpensive**2 * P**3 * stableCheap**3 *
          U**5 + 3 * basicCheap**3 * basicExpensive**3 * P**3 *
          stableCheap**3 * U**5 - 9 * basicCheap**3 * basicExpensive**3 *
          stableCheap**2 * stableExpensive * U**5 - 18 * basicCheap**2 *
          basicExpensive**4 * stableCheap**2 * stableExpensive * U**5 - 9 *
          basicCheap * basicExpensive**5 * stableCheap**2 * stableExpensive *
          U**5 - 18 * basicCheap**4 * basicExpensive**2 * P * stableCheap**2 *
          stableExpensive * U**5 - 36 * basicCheap**3 * basicExpensive**3 * P *
          stableCheap**2 * stableExpensive * U**5 - 18 * basicCheap**2 *
          basicExpensive**4 * P * stableCheap**2 * stableExpensive * U**5 -
          9 * basicCheap**5 * basicExpensive * P**2 * stableCheap**2 *
          stableExpensive * U**5 - 18 * basicCheap**4 * basicExpensive**2 *
          P**2 * stableCheap**2 * stableExpensive * U**5 - 9 * basicCheap**3 *
          basicExpensive**3 * P**2 * stableCheap**2 * stableExpensive * U**5 -
          2 * basicCheap**3 * basicExpensive**3 * stableCheap**3 * U**6 -
          6 * basicCheap**2 * basicExpensive**4 * stableCheap**3 * U**6 -
          6 * basicCheap * basicExpensive**5 * stableCheap**3 * U**6 -
          2 * basicExpensive**6 * stableCheap**3 * U**6 -
          6 * basicCheap**4 * basicExpensive**2 * P * stableCheap**3 * U**6 -
          18 * basicCheap**3 * basicExpensive**3 * P * stableCheap**3 * U**6 -
          18 * basicCheap**2 * basicExpensive**4 * P * stableCheap**3 * U**6 -
          6 * basicCheap * basicExpensive**5 * P * stableCheap**3 * U**6 -
          6 * basicCheap**5 * basicExpensive * P**2 * stableCheap**3 * U**6 -
          18 * basicCheap**4 * basicExpensive**2 * P**2 * stableCheap**3 *
          U**6 - 18 * basicCheap**3 * basicExpensive**3 * P**2 *
          stableCheap**3 * U**6 - 6 * basicCheap**2 * basicExpensive**4 *
          P**2 * stableCheap**3 * U**6 - 2 * basicCheap**6 * P**3 *
          stableCheap**3 * U**6 - 6 * basicCheap**5 * basicExpensive * P**3 *
          stableCheap**3 * U**6 - 6 * basicCheap**4 * basicExpensive**2 *
          P**3 * stableCheap**3 * U**6 - 2 * basicCheap**3 *
          basicExpensive**3 * P**3 * stableCheap**3 * U**6)**2 + 4 *
         (3 *
          (basicExpensive**2 * stableCheap**2 + basicCheap * basicExpensive *
           stableCheap**2 * U + 2 * basicExpensive**2 * stableCheap**2 * U +
           basicCheap * basicExpensive * P * stableCheap**2 * U -
           basicCheap * basicExpensive * stableCheap * stableExpensive * U) *
          (basicCheap * basicExpensive * U**2 + basicExpensive**2 * U**2 +
           basicCheap**2 * P * U**2 + basicCheap * basicExpensive * P * U**2) -
          (basicCheap * basicExpensive * stableCheap * U +
           2 * basicExpensive**2 * stableCheap * U + basicCheap *
           basicExpensive * P * stableCheap * U + basicCheap * basicExpensive *
           stableCheap * U**2 + basicExpensive**2 * stableCheap * U**2 +
           basicCheap**2 * P * stableCheap * U**2 +
           basicCheap * basicExpensive * P * stableCheap * U**2)**2)**3))**
    (1 / 3)) + (
        1 /
        (3 * 2**(1 / 3) *
         (basicCheap * basicExpensive * U**2 + basicExpensive**2 * U**2 +
          basicCheap**2 * P * U**2 + basicCheap * basicExpensive * P * U**2))
    ) * (-2 * basicCheap**3 * basicExpensive**3 * stableCheap**3 * U**3 -
         3 * basicCheap**2 * basicExpensive**4 * stableCheap**3 * U**3 +
         3 * basicCheap * basicExpensive**5 * stableCheap**3 * U**3 +
         2 * basicExpensive**6 * stableCheap**3 * U**3 +
         3 * basicCheap**3 * basicExpensive**3 * P * stableCheap**3 * U**3 +
         12 * basicCheap**2 * basicExpensive**4 * P * stableCheap**3 * U**3 +
         3 * basicCheap * basicExpensive**5 * P * stableCheap**3 * U**3 +
         3 * basicCheap**3 * basicExpensive**3 * P**2 * stableCheap**3 * U**3 -
         3 * basicCheap**2 * basicExpensive**4 * P**2 * stableCheap**3 * U**3 -
         2 * basicCheap**3 * basicExpensive**3 * P**3 * stableCheap**3 * U**3 +
         3 * basicCheap**3 * basicExpensive**3 * stableCheap**3 * U**4 -
         3 * basicCheap**2 * basicExpensive**4 * stableCheap**3 * U**4 -
         12 * basicCheap * basicExpensive**5 * stableCheap**3 * U**4 -
         6 * basicExpensive**6 * stableCheap**3 * U**4 +
         3 * basicCheap**4 * basicExpensive**2 * P * stableCheap**3 * U**4 -
         15 * basicCheap**3 * basicExpensive**3 * P * stableCheap**3 * U**4 -
         30 * basicCheap**2 * basicExpensive**4 * P * stableCheap**3 * U**4 -
         12 * basicCheap * basicExpensive**5 * P * stableCheap**3 * U**4 - 12 *
         basicCheap**4 * basicExpensive**2 * P**2 * stableCheap**3 * U**4 - 15
         * basicCheap**3 * basicExpensive**3 * P**2 * stableCheap**3 * U**4 -
         3 * basicCheap**2 * basicExpensive**4 * P**2 * stableCheap**3 * U**4 +
         3 * basicCheap**4 * basicExpensive**2 * P**3 * stableCheap**3 * U**4 +
         3 * basicCheap**3 * basicExpensive**3 * P**3 * stableCheap**3 * U**4 +
         18 * basicCheap**3 * basicExpensive**3 * stableCheap**2 *
         stableExpensive * U**4 + 27 * basicCheap**2 * basicExpensive**4 *
         stableCheap**2 * stableExpensive * U**4 + 9 * basicCheap *
         basicExpensive**5 * stableCheap**2 * stableExpensive * U**4 +
         45 * basicCheap**4 * basicExpensive**2 * P * stableCheap**2 *
         stableExpensive * U**4 + 72 * basicCheap**3 * basicExpensive**3 * P *
         stableCheap**2 * stableExpensive * U**4 + 27 * basicCheap**2 *
         basicExpensive**4 * P * stableCheap**2 * stableExpensive * U**4 +
         27 * basicCheap**5 * basicExpensive * P**2 * stableCheap**2 *
         stableExpensive * U**4 + 45 * basicCheap**4 * basicExpensive**2 *
         P**2 * stableCheap**2 * stableExpensive * U**4 + 18 * basicCheap**3 *
         basicExpensive**3 * P**2 * stableCheap**2 * stableExpensive * U**4 +
         3 * basicCheap**3 * basicExpensive**3 * stableCheap**3 * U**5 +
         12 * basicCheap**2 * basicExpensive**4 * stableCheap**3 * U**5 +
         15 * basicCheap * basicExpensive**5 * stableCheap**3 * U**5 +
         6 * basicExpensive**6 * stableCheap**3 * U**5 +
         6 * basicCheap**4 * basicExpensive**2 * P * stableCheap**3 * U**5 +
         27 * basicCheap**3 * basicExpensive**3 * P * stableCheap**3 * U**5 +
         36 * basicCheap**2 * basicExpensive**4 * P * stableCheap**3 * U**5 +
         15 * basicCheap * basicExpensive**5 * P * stableCheap**3 * U**5 + 3 *
         basicCheap**5 * basicExpensive * P**2 * stableCheap**3 * U**5 + 18 *
         basicCheap**4 * basicExpensive**2 * P**2 * stableCheap**3 * U**5 + 27
         * basicCheap**3 * basicExpensive**3 * P**2 * stableCheap**3 * U**5 +
         12 * basicCheap**2 * basicExpensive**4 * P**2 * stableCheap**3 * U**5
         + 3 * basicCheap**5 * basicExpensive * P**3 * stableCheap**3 * U**5 +
         6 * basicCheap**4 * basicExpensive**2 * P**3 * stableCheap**3 * U**5 +
         3 * basicCheap**3 * basicExpensive**3 * P**3 * stableCheap**3 * U**5 -
         9 * basicCheap**3 * basicExpensive**3 * stableCheap**2 *
         stableExpensive * U**5 - 18 * basicCheap**2 * basicExpensive**4 *
         stableCheap**2 * stableExpensive * U**5 - 9 * basicCheap *
         basicExpensive**5 * stableCheap**2 * stableExpensive * U**5 -
         18 * basicCheap**4 * basicExpensive**2 * P * stableCheap**2 *
         stableExpensive * U**5 - 36 * basicCheap**3 * basicExpensive**3 * P *
         stableCheap**2 * stableExpensive * U**5 - 18 * basicCheap**2 *
         basicExpensive**4 * P * stableCheap**2 * stableExpensive * U**5 -
         9 * basicCheap**5 * basicExpensive * P**2 * stableCheap**2 *
         stableExpensive * U**5 - 18 * basicCheap**4 * basicExpensive**2 *
         P**2 * stableCheap**2 * stableExpensive * U**5 - 9 * basicCheap**3 *
         basicExpensive**3 * P**2 * stableCheap**2 * stableExpensive * U**5 -
         2 * basicCheap**3 * basicExpensive**3 * stableCheap**3 * U**6 -
         6 * basicCheap**2 * basicExpensive**4 * stableCheap**3 * U**6 -
         6 * basicCheap * basicExpensive**5 * stableCheap**3 * U**6 -
         2 * basicExpensive**6 * stableCheap**3 * U**6 -
         6 * basicCheap**4 * basicExpensive**2 * P * stableCheap**3 * U**6 -
         18 * basicCheap**3 * basicExpensive**3 * P * stableCheap**3 * U**6 -
         18 * basicCheap**2 * basicExpensive**4 * P * stableCheap**3 * U**6 -
         6 * basicCheap * basicExpensive**5 * P * stableCheap**3 * U**6 -
         6 * basicCheap**5 * basicExpensive * P**2 * stableCheap**3 * U**6 -
         18 * basicCheap**4 * basicExpensive**2 * P**2 * stableCheap**3 * U**6
         - 18 * basicCheap**3 * basicExpensive**3 * P**2 * stableCheap**3 *
         U**6 - 6 * basicCheap**2 * basicExpensive**4 * P**2 * stableCheap**3 *
         U**6 - 2 * basicCheap**6 * P**3 * stableCheap**3 * U**6 -
         6 * basicCheap**5 * basicExpensive * P**3 * stableCheap**3 * U**6 -
         6 * basicCheap**4 * basicExpensive**2 * P**3 * stableCheap**3 * U**6 -
         2 * basicCheap**3 * basicExpensive**3 * P**3 * stableCheap**3 * U**6 +
         cmath.sqrt(
             (-2 * basicCheap**3 * basicExpensive**3 * stableCheap**3 * U**3 -
              3 * basicCheap**2 * basicExpensive**4 * stableCheap**3 * U**3 +
              3 * basicCheap * basicExpensive**5 * stableCheap**3 * U**3 + 2 *
              basicExpensive**6 * stableCheap**3 * U**3 + 3 * basicCheap**3 *
              basicExpensive**3 * P * stableCheap**3 * U**3 + 12 *
              basicCheap**2 * basicExpensive**4 * P * stableCheap**3 * U**3 +
              3 * basicCheap * basicExpensive**5 * P * stableCheap**3 * U**3 +
              3 * basicCheap**3 * basicExpensive**3 * P**2 * stableCheap**3 *
              U**3 - 3 * basicCheap**2 * basicExpensive**4 * P**2 *
              stableCheap**3 * U**3 - 2 * basicCheap**3 * basicExpensive**3 *
              P**3 * stableCheap**3 * U**3 +
              3 * basicCheap**3 * basicExpensive**3 * stableCheap**3 * U**4 -
              3 * basicCheap**2 * basicExpensive**4 * stableCheap**3 * U**4 -
              12 * basicCheap * basicExpensive**5 * stableCheap**3 * U**4 - 6 *
              basicExpensive**6 * stableCheap**3 * U**4 + 3 * basicCheap**4 *
              basicExpensive**2 * P * stableCheap**3 * U**4 - 15 * basicCheap**
              3 * basicExpensive**3 * P * stableCheap**3 * U**4 - 30 *
              basicCheap**2 * basicExpensive**4 * P * stableCheap**3 * U**4 -
              12 * basicCheap * basicExpensive**5 * P * stableCheap**3 * U**4 -
              12 * basicCheap**4 * basicExpensive**2 * P**2 * stableCheap**3 *
              U**4 - 15 * basicCheap**3 * basicExpensive**3 * P**2 *
              stableCheap**3 * U**4 - 3 * basicCheap**2 * basicExpensive**4 *
              P**2 * stableCheap**3 * U**4 + 3 * basicCheap**4 *
              basicExpensive**2 * P**3 * stableCheap**3 * U**4 +
              3 * basicCheap**3 * basicExpensive**3 * P**3 * stableCheap**3 *
              U**4 + 18 * basicCheap**3 * basicExpensive**3 * stableCheap**2 *
              stableExpensive * U**4 + 27 * basicCheap**2 * basicExpensive**4 *
              stableCheap**2 * stableExpensive * U**4 + 9 * basicCheap *
              basicExpensive**5 * stableCheap**2 * stableExpensive * U**4 +
              45 * basicCheap**4 * basicExpensive**2 * P * stableCheap**2 *
              stableExpensive * U**4 + 72 * basicCheap**3 * basicExpensive**3 *
              P * stableCheap**2 * stableExpensive * U**4 +
              27 * basicCheap**2 * basicExpensive**4 * P * stableCheap**2 *
              stableExpensive * U**4 + 27 * basicCheap**5 * basicExpensive *
              P**2 * stableCheap**2 * stableExpensive * U**4 +
              45 * basicCheap**4 * basicExpensive**2 * P**2 * stableCheap**2 *
              stableExpensive * U**4 + 18 * basicCheap**3 * basicExpensive**3 *
              P**2 * stableCheap**2 * stableExpensive * U**4 +
              3 * basicCheap**3 * basicExpensive**3 * stableCheap**3 * U**5 +
              12 * basicCheap**2 * basicExpensive**4 * stableCheap**3 * U**5 +
              15 * basicCheap * basicExpensive**5 * stableCheap**3 * U**5 + 6 *
              basicExpensive**6 * stableCheap**3 * U**5 + 6 * basicCheap**4 *
              basicExpensive**2 * P * stableCheap**3 * U**5 + 27 * basicCheap**
              3 * basicExpensive**3 * P * stableCheap**3 * U**5 + 36 *
              basicCheap**2 * basicExpensive**4 * P * stableCheap**3 * U**5 +
              15 * basicCheap * basicExpensive**5 * P * stableCheap**3 * U**5 +
              3 * basicCheap**5 * basicExpensive * P**2 * stableCheap**3 *
              U**5 + 18 * basicCheap**4 * basicExpensive**2 * P**2 *
              stableCheap**3 * U**5 + 27 * basicCheap**3 * basicExpensive**3 *
              P**2 * stableCheap**3 * U**5 + 12 * basicCheap**2 *
              basicExpensive**4 * P**2 * stableCheap**3 * U**5 + 3 *
              basicCheap**5 * basicExpensive * P**3 * stableCheap**3 * U**5 +
              6 * basicCheap**4 * basicExpensive**2 * P**3 * stableCheap**3 *
              U**5 + 3 * basicCheap**3 * basicExpensive**3 * P**3 *
              stableCheap**3 * U**5 - 9 * basicCheap**3 * basicExpensive**3 *
              stableCheap**2 * stableExpensive * U**5 - 18 * basicCheap**2 *
              basicExpensive**4 * stableCheap**2 * stableExpensive * U**5 -
              9 * basicCheap * basicExpensive**5 * stableCheap**2 *
              stableExpensive * U**5 - 18 * basicCheap**4 * basicExpensive**2 *
              P * stableCheap**2 * stableExpensive * U**5 -
              36 * basicCheap**3 * basicExpensive**3 * P * stableCheap**2 *
              stableExpensive * U**5 - 18 * basicCheap**2 * basicExpensive**4 *
              P * stableCheap**2 * stableExpensive * U**5 - 9 * basicCheap**5 *
              basicExpensive * P**2 * stableCheap**2 * stableExpensive * U**5 -
              18 * basicCheap**4 * basicExpensive**2 * P**2 * stableCheap**2 *
              stableExpensive * U**5 - 9 * basicCheap**3 * basicExpensive**3 *
              P**2 * stableCheap**2 * stableExpensive * U**5 -
              2 * basicCheap**3 * basicExpensive**3 * stableCheap**3 * U**6 -
              6 * basicCheap**2 * basicExpensive**4 * stableCheap**3 * U**6 -
              6 * basicCheap * basicExpensive**5 * stableCheap**3 * U**6 - 2 *
              basicExpensive**6 * stableCheap**3 * U**6 - 6 * basicCheap**4 *
              basicExpensive**2 * P * stableCheap**3 * U**6 - 18 *
              basicCheap**3 * basicExpensive**3 * P * stableCheap**3 * U**6 -
              18 * basicCheap**2 * basicExpensive**4 * P * stableCheap**3 *
              U**6 - 6 * basicCheap * basicExpensive**5 * P * stableCheap**3 *
              U**6 - 6 * basicCheap**5 * basicExpensive * P**2 *
              stableCheap**3 * U**6 - 18 * basicCheap**4 * basicExpensive**2 *
              P**2 * stableCheap**3 * U**6 - 18 * basicCheap**3 *
              basicExpensive**3 * P**2 * stableCheap**3 * U**6 -
              6 * basicCheap**2 * basicExpensive**4 * P**2 * stableCheap**3 *
              U**6 - 2 * basicCheap**6 * P**3 * stableCheap**3 * U**6 - 6 *
              basicCheap**5 * basicExpensive * P**3 * stableCheap**3 * U**6 -
              6 * basicCheap**4 * basicExpensive**2 * P**3 * stableCheap**3 *
              U**6 - 2 * basicCheap**3 * basicExpensive**3 * P**3 *
              stableCheap**3 * U**6)**2 + 4 *
             (3 * (basicExpensive**2 * stableCheap**2 +
                   basicCheap * basicExpensive * stableCheap**2 * U +
                   2 * basicExpensive**2 * stableCheap**2 * U + basicCheap *
                   basicExpensive * P * stableCheap**2 * U - basicCheap *
                   basicExpensive * stableCheap * stableExpensive * U) *
              (basicCheap * basicExpensive * U**2 + basicExpensive**2 * U**2 +
               basicCheap**2 * P * U**2 +
               basicCheap * basicExpensive * P * U**2) -
              (basicCheap * basicExpensive * stableCheap * U +
               2 * basicExpensive**2 * stableCheap * U +
               basicCheap * basicExpensive * P * stableCheap * U + basicCheap *
               basicExpensive * stableCheap * U**2 + basicExpensive**2 *
               stableCheap * U**2 + basicCheap**2 * P * stableCheap * U**2 +
               basicCheap * basicExpensive * P * stableCheap * U**2)**2)**3)
         )**(1 / 3)

print(x.real)