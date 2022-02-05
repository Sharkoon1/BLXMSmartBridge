import sys
import cmath

basicCheap = float(sys.argv[1])
stableCheap = float(sys.argv[2])

basicExpensive = float(sys.argv[3])
stableExpensive = float(sys.argv[4])

feesExpensive = float(sys.argv[5])
feesCheap = float(sys.argv[6])

x = -(
    (basicCheap * basicExpensive * stableCheap * feesCheap + 2 * basicExpensive**2 *
     stableCheap * feesCheap + basicCheap * basicExpensive * feesExpensive * stableCheap * feesCheap +
     basicCheap * basicExpensive * stableCheap * feesCheap**2 + basicExpensive**2 *
     stableCheap * feesCheap**2 + basicCheap**2 * feesExpensive * stableCheap * feesCheap**2 +
     basicCheap * basicExpensive * feesExpensive * stableCheap * feesCheap**2) /
    (3 * (basicCheap * basicExpensive * feesCheap**2 + basicExpensive**2 * feesCheap**2 +
          basicCheap**2 * feesExpensive * feesCheap**2 + basicCheap * basicExpensive * feesExpensive * feesCheap**2))
) - (
    2**(1 / 3) *
    (3 * (basicExpensive**2 * stableCheap**2 + basicCheap * basicExpensive *
          stableCheap**2 * feesCheap + 2 * basicExpensive**2 * stableCheap**2 * feesCheap +
          basicCheap * basicExpensive * feesExpensive * stableCheap**2 * feesCheap -
          basicCheap * basicExpensive * stableCheap * stableExpensive * feesCheap) *
     (basicCheap * basicExpensive * feesCheap**2 + basicExpensive**2 * feesCheap**2 +
      basicCheap**2 * feesExpensive * feesCheap**2 + basicCheap * basicExpensive * feesExpensive * feesCheap**2) -
     (basicCheap * basicExpensive * stableCheap * feesCheap + 2 * basicExpensive**2 *
      stableCheap * feesCheap + basicCheap * basicExpensive * feesExpensive * stableCheap * feesCheap +
      basicCheap * basicExpensive * stableCheap * feesCheap**2 + basicExpensive**2 *
      stableCheap * feesCheap**2 + basicCheap**2 * feesExpensive * stableCheap * feesCheap**2 +
      basicCheap * basicExpensive * feesExpensive * stableCheap * feesCheap**2)**2)
) / (
    3 *
    (basicCheap * basicExpensive * feesCheap**2 + basicExpensive**2 * feesCheap**2
     + basicCheap**2 * feesExpensive * feesCheap**2 + basicCheap * basicExpensive * feesExpensive * feesCheap**2) *
    (-2 * basicCheap**3 * basicExpensive**3 * stableCheap**3 * feesCheap**3 -
     3 * basicCheap**2 * basicExpensive**4 * stableCheap**3 * feesCheap**3 +
     3 * basicCheap * basicExpensive**5 * stableCheap**3 * feesCheap**3 +
     2 * basicExpensive**6 * stableCheap**3 * feesCheap**3 +
     3 * basicCheap**3 * basicExpensive**3 * feesExpensive * stableCheap**3 * feesCheap**3 +
     12 * basicCheap**2 * basicExpensive**4 * feesExpensive * stableCheap**3 * feesCheap**3 +
     3 * basicCheap * basicExpensive**5 * feesExpensive * stableCheap**3 * feesCheap**3 +
     3 * basicCheap**3 * basicExpensive**3 * feesExpensive**2 * stableCheap**3 * feesCheap**3 -
     3 * basicCheap**2 * basicExpensive**4 * feesExpensive**2 * stableCheap**3 * feesCheap**3 -
     2 * basicCheap**3 * basicExpensive**3 * feesExpensive**3 * stableCheap**3 * feesCheap**3 +
     3 * basicCheap**3 * basicExpensive**3 * stableCheap**3 * feesCheap**4 -
     3 * basicCheap**2 * basicExpensive**4 * stableCheap**3 * feesCheap**4 -
     12 * basicCheap * basicExpensive**5 * stableCheap**3 * feesCheap**4 -
     6 * basicExpensive**6 * stableCheap**3 * feesCheap**4 +
     3 * basicCheap**4 * basicExpensive**2 * feesExpensive * stableCheap**3 * feesCheap**4 -
     15 * basicCheap**3 * basicExpensive**3 * feesExpensive * stableCheap**3 * feesCheap**4 -
     30 * basicCheap**2 * basicExpensive**4 * feesExpensive * stableCheap**3 * feesCheap**4 -
     12 * basicCheap * basicExpensive**5 * feesExpensive * stableCheap**3 * feesCheap**4 -
     12 * basicCheap**4 * basicExpensive**2 * feesExpensive**2 * stableCheap**3 * feesCheap**4 -
     15 * basicCheap**3 * basicExpensive**3 * feesExpensive**2 * stableCheap**3 * feesCheap**4 -
     3 * basicCheap**2 * basicExpensive**4 * feesExpensive**2 * stableCheap**3 * feesCheap**4 +
     3 * basicCheap**4 * basicExpensive**2 * feesExpensive**3 * stableCheap**3 * feesCheap**4 +
     3 * basicCheap**3 * basicExpensive**3 * feesExpensive**3 * stableCheap**3 * feesCheap**4 +
     18 * basicCheap**3 * basicExpensive**3 * stableCheap**2 * stableExpensive
     * feesCheap**4 + 27 * basicCheap**2 * basicExpensive**4 * stableCheap**2 *
     stableExpensive * feesCheap**4 + 9 * basicCheap * basicExpensive**5 * stableCheap
     **2 * stableExpensive * feesCheap**4 + 45 * basicCheap**4 * basicExpensive**2 *
     feesExpensive * stableCheap**2 * stableExpensive * feesCheap**4 + 72 * basicCheap**3 *
     basicExpensive**3 * feesExpensive * stableCheap**2 * stableExpensive * feesCheap**4 + 27 *
     basicCheap**2 * basicExpensive**4 * feesExpensive * stableCheap**2 * stableExpensive
     * feesCheap**4 + 27 * basicCheap**5 * basicExpensive * feesExpensive**2 * stableCheap**2 *
     stableExpensive * feesCheap**4 + 45 * basicCheap**4 * basicExpensive**2 * feesExpensive**2 *
     stableCheap**2 * stableExpensive * feesCheap**4 + 18 * basicCheap**3 *
     basicExpensive**3 * feesExpensive**2 * stableCheap**2 * stableExpensive * feesCheap**4 +
     3 * basicCheap**3 * basicExpensive**3 * stableCheap**3 * feesCheap**5 +
     12 * basicCheap**2 * basicExpensive**4 * stableCheap**3 * feesCheap**5 +
     15 * basicCheap * basicExpensive**5 * stableCheap**3 * feesCheap**5 +
     6 * basicExpensive**6 * stableCheap**3 * feesCheap**5 +
     6 * basicCheap**4 * basicExpensive**2 * feesExpensive * stableCheap**3 * feesCheap**5 +
     27 * basicCheap**3 * basicExpensive**3 * feesExpensive * stableCheap**3 * feesCheap**5 +
     36 * basicCheap**2 * basicExpensive**4 * feesExpensive * stableCheap**3 * feesCheap**5 +
     15 * basicCheap * basicExpensive**5 * feesExpensive * stableCheap**3 * feesCheap**5 +
     3 * basicCheap**5 * basicExpensive * feesExpensive**2 * stableCheap**3 * feesCheap**5 +
     18 * basicCheap**4 * basicExpensive**2 * feesExpensive**2 * stableCheap**3 * feesCheap**5 +
     27 * basicCheap**3 * basicExpensive**3 * feesExpensive**2 * stableCheap**3 * feesCheap**5 +
     12 * basicCheap**2 * basicExpensive**4 * feesExpensive**2 * stableCheap**3 * feesCheap**5 +
     3 * basicCheap**5 * basicExpensive * feesExpensive**3 * stableCheap**3 * feesCheap**5 +
     6 * basicCheap**4 * basicExpensive**2 * feesExpensive**3 * stableCheap**3 * feesCheap**5 +
     3 * basicCheap**3 * basicExpensive**3 * feesExpensive**3 * stableCheap**3 * feesCheap**5 -
     9 * basicCheap**3 * basicExpensive**3 * stableCheap**2 * stableExpensive *
     feesCheap**5 - 18 * basicCheap**2 * basicExpensive**4 * stableCheap**2 *
     stableExpensive * feesCheap**5 - 9 * basicCheap * basicExpensive**5 * stableCheap
     **2 * stableExpensive * feesCheap**5 - 18 * basicCheap**4 * basicExpensive**2 *
     feesExpensive * stableCheap**2 * stableExpensive * feesCheap**5 - 36 * basicCheap**3 *
     basicExpensive**3 * feesExpensive * stableCheap**2 * stableExpensive * feesCheap**5 - 18 *
     basicCheap**2 * basicExpensive**4 * feesExpensive * stableCheap**2 * stableExpensive *
     feesCheap**5 - 9 * basicCheap**5 * basicExpensive * feesExpensive**2 * stableCheap**2 *
     stableExpensive * feesCheap**5 - 18 * basicCheap**4 * basicExpensive**2 * feesExpensive**2 *
     stableCheap**2 * stableExpensive * feesCheap**5 - 9 * basicCheap**3 *
     basicExpensive**3 * feesExpensive**2 * stableCheap**2 * stableExpensive * feesCheap**5 -
     2 * basicCheap**3 * basicExpensive**3 * stableCheap**3 * feesCheap**6 -
     6 * basicCheap**2 * basicExpensive**4 * stableCheap**3 * feesCheap**6 -
     6 * basicCheap * basicExpensive**5 * stableCheap**3 * feesCheap**6 -
     2 * basicExpensive**6 * stableCheap**3 * feesCheap**6 -
     6 * basicCheap**4 * basicExpensive**2 * feesExpensive * stableCheap**3 * feesCheap**6 -
     18 * basicCheap**3 * basicExpensive**3 * feesExpensive * stableCheap**3 * feesCheap**6 -
     18 * basicCheap**2 * basicExpensive**4 * feesExpensive * stableCheap**3 * feesCheap**6 -
     6 * basicCheap * basicExpensive**5 * feesExpensive * stableCheap**3 * feesCheap**6 -
     6 * basicCheap**5 * basicExpensive * feesExpensive**2 * stableCheap**3 * feesCheap**6 -
     18 * basicCheap**4 * basicExpensive**2 * feesExpensive**2 * stableCheap**3 * feesCheap**6 -
     18 * basicCheap**3 * basicExpensive**3 * feesExpensive**2 * stableCheap**3 * feesCheap**6 -
     6 * basicCheap**2 * basicExpensive**4 * feesExpensive**2 * stableCheap**3 * feesCheap**6 -
     2 * basicCheap**6 * feesExpensive**3 * stableCheap**3 * feesCheap**6 - 6 * basicCheap**5 *
     basicExpensive * feesExpensive**3 * stableCheap**3 * feesCheap**6 - 6 * basicCheap**4 *
     basicExpensive**2 * feesExpensive**3 * stableCheap**3 * feesCheap**6 - 2 * basicCheap**3 *
     basicExpensive**3 * feesExpensive**3 * stableCheap**3 * feesCheap**6 + cmath.sqrt(
         (-2 * basicCheap**3 * basicExpensive**3 * stableCheap**3 * feesCheap**3 -
          3 * basicCheap**2 * basicExpensive**4 * stableCheap**3 * feesCheap**3 +
          3 * basicCheap * basicExpensive**5 * stableCheap**3 * feesCheap**3 +
          2 * basicExpensive**6 * stableCheap**3 * feesCheap**3 +
          3 * basicCheap**3 * basicExpensive**3 * feesExpensive * stableCheap**3 * feesCheap**3 +
          12 * basicCheap**2 * basicExpensive**4 * feesExpensive * stableCheap**3 * feesCheap**3 +
          3 * basicCheap * basicExpensive**5 * feesExpensive * stableCheap**3 * feesCheap**3 + 3 *
          basicCheap**3 * basicExpensive**3 * feesExpensive**2 * stableCheap**3 * feesCheap**3 -
          3 * basicCheap**2 * basicExpensive**4 * feesExpensive**2 * stableCheap**3 * feesCheap**3
          - 2 * basicCheap**3 * basicExpensive**3 * feesExpensive**3 * stableCheap**3 *
          feesCheap**3 + 3 * basicCheap**3 * basicExpensive**3 * stableCheap**3 *
          feesCheap**4 - 3 * basicCheap**2 * basicExpensive**4 * stableCheap**3 *
          feesCheap**4 - 12 * basicCheap * basicExpensive**5 * stableCheap**3 * feesCheap**4 -
          6 * basicExpensive**6 * stableCheap**3 * feesCheap**4 +
          3 * basicCheap**4 * basicExpensive**2 * feesExpensive * stableCheap**3 * feesCheap**4 -
          15 * basicCheap**3 * basicExpensive**3 * feesExpensive * stableCheap**3 * feesCheap**4 -
          30 * basicCheap**2 * basicExpensive**4 * feesExpensive * stableCheap**3 * feesCheap**4 -
          12 * basicCheap * basicExpensive**5 * feesExpensive * stableCheap**3 * feesCheap**4 -
          12 * basicCheap**4 * basicExpensive**2 * feesExpensive**2 * stableCheap**3 *
          feesCheap**4 - 15 * basicCheap**3 * basicExpensive**3 * feesExpensive**2 *
          stableCheap**3 * feesCheap**4 - 3 * basicCheap**2 * basicExpensive**4 *
          feesExpensive**2 * stableCheap**3 * feesCheap**4 + 3 * basicCheap**4 *
          basicExpensive**2 * feesExpensive**3 * stableCheap**3 * feesCheap**4 + 3 *
          basicCheap**3 * basicExpensive**3 * feesExpensive**3 * stableCheap**3 * feesCheap**4 +
          18 * basicCheap**3 * basicExpensive**3 * stableCheap**2 *
          stableExpensive * feesCheap**4 + 27 * basicCheap**2 * basicExpensive**4 *
          stableCheap**2 * stableExpensive * feesCheap**4 + 9 * basicCheap *
          basicExpensive**5 * stableCheap**2 * stableExpensive * feesCheap**4 +
          45 * basicCheap**4 * basicExpensive**2 * feesExpensive * stableCheap**2 *
          stableExpensive * feesCheap**4 + 72 * basicCheap**3 * basicExpensive**3 * feesExpensive *
          stableCheap**2 * stableExpensive * feesCheap**4 + 27 * basicCheap**2 *
          basicExpensive**4 * feesExpensive * stableCheap**2 * stableExpensive * feesCheap**4 +
          27 * basicCheap**5 * basicExpensive * feesExpensive**2 * stableCheap**2 *
          stableExpensive * feesCheap**4 + 45 * basicCheap**4 * basicExpensive**2 *
          feesExpensive**2 * stableCheap**2 * stableExpensive * feesCheap**4 + 18 * basicCheap**3 *
          basicExpensive**3 * feesExpensive**2 * stableCheap**2 * stableExpensive * feesCheap**4 +
          3 * basicCheap**3 * basicExpensive**3 * stableCheap**3 * feesCheap**5 +
          12 * basicCheap**2 * basicExpensive**4 * stableCheap**3 * feesCheap**5 +
          15 * basicCheap * basicExpensive**5 * stableCheap**3 * feesCheap**5 +
          6 * basicExpensive**6 * stableCheap**3 * feesCheap**5 +
          6 * basicCheap**4 * basicExpensive**2 * feesExpensive * stableCheap**3 * feesCheap**5 +
          27 * basicCheap**3 * basicExpensive**3 * feesExpensive * stableCheap**3 * feesCheap**5 +
          36 * basicCheap**2 * basicExpensive**4 * feesExpensive * stableCheap**3 * feesCheap**5 +
          15 * basicCheap * basicExpensive**5 * feesExpensive * stableCheap**3 * feesCheap**5 + 3 *
          basicCheap**5 * basicExpensive * feesExpensive**2 * stableCheap**3 * feesCheap**5 + 18 *
          basicCheap**4 * basicExpensive**2 * feesExpensive**2 * stableCheap**3 * feesCheap**5 + 27
          * basicCheap**3 * basicExpensive**3 * feesExpensive**2 * stableCheap**3 * feesCheap**5 +
          12 * basicCheap**2 * basicExpensive**4 * feesExpensive**2 * stableCheap**3 * feesCheap**5
          + 3 * basicCheap**5 * basicExpensive * feesExpensive**3 * stableCheap**3 * feesCheap**5 +
          6 * basicCheap**4 * basicExpensive**2 * feesExpensive**3 * stableCheap**3 *
          feesCheap**5 + 3 * basicCheap**3 * basicExpensive**3 * feesExpensive**3 *
          stableCheap**3 * feesCheap**5 - 9 * basicCheap**3 * basicExpensive**3 *
          stableCheap**2 * stableExpensive * feesCheap**5 - 18 * basicCheap**2 *
          basicExpensive**4 * stableCheap**2 * stableExpensive * feesCheap**5 - 9 *
          basicCheap * basicExpensive**5 * stableCheap**2 * stableExpensive *
          feesCheap**5 - 18 * basicCheap**4 * basicExpensive**2 * feesExpensive * stableCheap**2 *
          stableExpensive * feesCheap**5 - 36 * basicCheap**3 * basicExpensive**3 * feesExpensive *
          stableCheap**2 * stableExpensive * feesCheap**5 - 18 * basicCheap**2 *
          basicExpensive**4 * feesExpensive * stableCheap**2 * stableExpensive * feesCheap**5 -
          9 * basicCheap**5 * basicExpensive * feesExpensive**2 * stableCheap**2 *
          stableExpensive * feesCheap**5 - 18 * basicCheap**4 * basicExpensive**2 *
          feesExpensive**2 * stableCheap**2 * stableExpensive * feesCheap**5 - 9 * basicCheap**3 *
          basicExpensive**3 * feesExpensive**2 * stableCheap**2 * stableExpensive * feesCheap**5 -
          2 * basicCheap**3 * basicExpensive**3 * stableCheap**3 * feesCheap**6 -
          6 * basicCheap**2 * basicExpensive**4 * stableCheap**3 * feesCheap**6 -
          6 * basicCheap * basicExpensive**5 * stableCheap**3 * feesCheap**6 -
          2 * basicExpensive**6 * stableCheap**3 * feesCheap**6 -
          6 * basicCheap**4 * basicExpensive**2 * feesExpensive * stableCheap**3 * feesCheap**6 -
          18 * basicCheap**3 * basicExpensive**3 * feesExpensive * stableCheap**3 * feesCheap**6 -
          18 * basicCheap**2 * basicExpensive**4 * feesExpensive * stableCheap**3 * feesCheap**6 -
          6 * basicCheap * basicExpensive**5 * feesExpensive * stableCheap**3 * feesCheap**6 -
          6 * basicCheap**5 * basicExpensive * feesExpensive**2 * stableCheap**3 * feesCheap**6 -
          18 * basicCheap**4 * basicExpensive**2 * feesExpensive**2 * stableCheap**3 *
          feesCheap**6 - 18 * basicCheap**3 * basicExpensive**3 * feesExpensive**2 *
          stableCheap**3 * feesCheap**6 - 6 * basicCheap**2 * basicExpensive**4 *
          feesExpensive**2 * stableCheap**3 * feesCheap**6 - 2 * basicCheap**6 * feesExpensive**3 *
          stableCheap**3 * feesCheap**6 - 6 * basicCheap**5 * basicExpensive * feesExpensive**3 *
          stableCheap**3 * feesCheap**6 - 6 * basicCheap**4 * basicExpensive**2 *
          feesExpensive**3 * stableCheap**3 * feesCheap**6 - 2 * basicCheap**3 *
          basicExpensive**3 * feesExpensive**3 * stableCheap**3 * feesCheap**6)**2 + 4 *
         (3 *
          (basicExpensive**2 * stableCheap**2 + basicCheap * basicExpensive *
           stableCheap**2 * feesCheap + 2 * basicExpensive**2 * stableCheap**2 * feesCheap +
           basicCheap * basicExpensive * feesExpensive * stableCheap**2 * feesCheap -
           basicCheap * basicExpensive * stableCheap * stableExpensive * feesCheap) *
          (basicCheap * basicExpensive * feesCheap**2 + basicExpensive**2 * feesCheap**2 +
           basicCheap**2 * feesExpensive * feesCheap**2 + basicCheap * basicExpensive * feesExpensive * feesCheap**2) -
          (basicCheap * basicExpensive * stableCheap * feesCheap +
           2 * basicExpensive**2 * stableCheap * feesCheap + basicCheap *
           basicExpensive * feesExpensive * stableCheap * feesCheap + basicCheap * basicExpensive *
           stableCheap * feesCheap**2 + basicExpensive**2 * stableCheap * feesCheap**2 +
           basicCheap**2 * feesExpensive * stableCheap * feesCheap**2 +
           basicCheap * basicExpensive * feesExpensive * stableCheap * feesCheap**2)**2)**3))**
    (1 / 3)) + (
        1 /
        (3 * 2**(1 / 3) *
         (basicCheap * basicExpensive * feesCheap**2 + basicExpensive**2 * feesCheap**2 +
          basicCheap**2 * feesExpensive * feesCheap**2 + basicCheap * basicExpensive * feesExpensive * feesCheap**2))
    ) * (-2 * basicCheap**3 * basicExpensive**3 * stableCheap**3 * feesCheap**3 -
         3 * basicCheap**2 * basicExpensive**4 * stableCheap**3 * feesCheap**3 +
         3 * basicCheap * basicExpensive**5 * stableCheap**3 * feesCheap**3 +
         2 * basicExpensive**6 * stableCheap**3 * feesCheap**3 +
         3 * basicCheap**3 * basicExpensive**3 * feesExpensive * stableCheap**3 * feesCheap**3 +
         12 * basicCheap**2 * basicExpensive**4 * feesExpensive * stableCheap**3 * feesCheap**3 +
         3 * basicCheap * basicExpensive**5 * feesExpensive * stableCheap**3 * feesCheap**3 +
         3 * basicCheap**3 * basicExpensive**3 * feesExpensive**2 * stableCheap**3 * feesCheap**3 -
         3 * basicCheap**2 * basicExpensive**4 * feesExpensive**2 * stableCheap**3 * feesCheap**3 -
         2 * basicCheap**3 * basicExpensive**3 * feesExpensive**3 * stableCheap**3 * feesCheap**3 +
         3 * basicCheap**3 * basicExpensive**3 * stableCheap**3 * feesCheap**4 -
         3 * basicCheap**2 * basicExpensive**4 * stableCheap**3 * feesCheap**4 -
         12 * basicCheap * basicExpensive**5 * stableCheap**3 * feesCheap**4 -
         6 * basicExpensive**6 * stableCheap**3 * feesCheap**4 +
         3 * basicCheap**4 * basicExpensive**2 * feesExpensive * stableCheap**3 * feesCheap**4 -
         15 * basicCheap**3 * basicExpensive**3 * feesExpensive * stableCheap**3 * feesCheap**4 -
         30 * basicCheap**2 * basicExpensive**4 * feesExpensive * stableCheap**3 * feesCheap**4 -
         12 * basicCheap * basicExpensive**5 * feesExpensive * stableCheap**3 * feesCheap**4 - 12 *
         basicCheap**4 * basicExpensive**2 * feesExpensive**2 * stableCheap**3 * feesCheap**4 - 15
         * basicCheap**3 * basicExpensive**3 * feesExpensive**2 * stableCheap**3 * feesCheap**4 -
         3 * basicCheap**2 * basicExpensive**4 * feesExpensive**2 * stableCheap**3 * feesCheap**4 +
         3 * basicCheap**4 * basicExpensive**2 * feesExpensive**3 * stableCheap**3 * feesCheap**4 +
         3 * basicCheap**3 * basicExpensive**3 * feesExpensive**3 * stableCheap**3 * feesCheap**4 +
         18 * basicCheap**3 * basicExpensive**3 * stableCheap**2 *
         stableExpensive * feesCheap**4 + 27 * basicCheap**2 * basicExpensive**4 *
         stableCheap**2 * stableExpensive * feesCheap**4 + 9 * basicCheap *
         basicExpensive**5 * stableCheap**2 * stableExpensive * feesCheap**4 +
         45 * basicCheap**4 * basicExpensive**2 * feesExpensive * stableCheap**2 *
         stableExpensive * feesCheap**4 + 72 * basicCheap**3 * basicExpensive**3 * feesExpensive *
         stableCheap**2 * stableExpensive * feesCheap**4 + 27 * basicCheap**2 *
         basicExpensive**4 * feesExpensive * stableCheap**2 * stableExpensive * feesCheap**4 +
         27 * basicCheap**5 * basicExpensive * feesExpensive**2 * stableCheap**2 *
         stableExpensive * feesCheap**4 + 45 * basicCheap**4 * basicExpensive**2 *
         feesExpensive**2 * stableCheap**2 * stableExpensive * feesCheap**4 + 18 * basicCheap**3 *
         basicExpensive**3 * feesExpensive**2 * stableCheap**2 * stableExpensive * feesCheap**4 +
         3 * basicCheap**3 * basicExpensive**3 * stableCheap**3 * feesCheap**5 +
         12 * basicCheap**2 * basicExpensive**4 * stableCheap**3 * feesCheap**5 +
         15 * basicCheap * basicExpensive**5 * stableCheap**3 * feesCheap**5 +
         6 * basicExpensive**6 * stableCheap**3 * feesCheap**5 +
         6 * basicCheap**4 * basicExpensive**2 * feesExpensive * stableCheap**3 * feesCheap**5 +
         27 * basicCheap**3 * basicExpensive**3 * feesExpensive * stableCheap**3 * feesCheap**5 +
         36 * basicCheap**2 * basicExpensive**4 * feesExpensive * stableCheap**3 * feesCheap**5 +
         15 * basicCheap * basicExpensive**5 * feesExpensive * stableCheap**3 * feesCheap**5 + 3 *
         basicCheap**5 * basicExpensive * feesExpensive**2 * stableCheap**3 * feesCheap**5 + 18 *
         basicCheap**4 * basicExpensive**2 * feesExpensive**2 * stableCheap**3 * feesCheap**5 + 27
         * basicCheap**3 * basicExpensive**3 * feesExpensive**2 * stableCheap**3 * feesCheap**5 +
         12 * basicCheap**2 * basicExpensive**4 * feesExpensive**2 * stableCheap**3 * feesCheap**5
         + 3 * basicCheap**5 * basicExpensive * feesExpensive**3 * stableCheap**3 * feesCheap**5 +
         6 * basicCheap**4 * basicExpensive**2 * feesExpensive**3 * stableCheap**3 * feesCheap**5 +
         3 * basicCheap**3 * basicExpensive**3 * feesExpensive**3 * stableCheap**3 * feesCheap**5 -
         9 * basicCheap**3 * basicExpensive**3 * stableCheap**2 *
         stableExpensive * feesCheap**5 - 18 * basicCheap**2 * basicExpensive**4 *
         stableCheap**2 * stableExpensive * feesCheap**5 - 9 * basicCheap *
         basicExpensive**5 * stableCheap**2 * stableExpensive * feesCheap**5 -
         18 * basicCheap**4 * basicExpensive**2 * feesExpensive * stableCheap**2 *
         stableExpensive * feesCheap**5 - 36 * basicCheap**3 * basicExpensive**3 * feesExpensive *
         stableCheap**2 * stableExpensive * feesCheap**5 - 18 * basicCheap**2 *
         basicExpensive**4 * feesExpensive * stableCheap**2 * stableExpensive * feesCheap**5 -
         9 * basicCheap**5 * basicExpensive * feesExpensive**2 * stableCheap**2 *
         stableExpensive * feesCheap**5 - 18 * basicCheap**4 * basicExpensive**2 *
         feesExpensive**2 * stableCheap**2 * stableExpensive * feesCheap**5 - 9 * basicCheap**3 *
         basicExpensive**3 * feesExpensive**2 * stableCheap**2 * stableExpensive * feesCheap**5 -
         2 * basicCheap**3 * basicExpensive**3 * stableCheap**3 * feesCheap**6 -
         6 * basicCheap**2 * basicExpensive**4 * stableCheap**3 * feesCheap**6 -
         6 * basicCheap * basicExpensive**5 * stableCheap**3 * feesCheap**6 -
         2 * basicExpensive**6 * stableCheap**3 * feesCheap**6 -
         6 * basicCheap**4 * basicExpensive**2 * feesExpensive * stableCheap**3 * feesCheap**6 -
         18 * basicCheap**3 * basicExpensive**3 * feesExpensive * stableCheap**3 * feesCheap**6 -
         18 * basicCheap**2 * basicExpensive**4 * feesExpensive * stableCheap**3 * feesCheap**6 -
         6 * basicCheap * basicExpensive**5 * feesExpensive * stableCheap**3 * feesCheap**6 -
         6 * basicCheap**5 * basicExpensive * feesExpensive**2 * stableCheap**3 * feesCheap**6 -
         18 * basicCheap**4 * basicExpensive**2 * feesExpensive**2 * stableCheap**3 * feesCheap**6
         - 18 * basicCheap**3 * basicExpensive**3 * feesExpensive**2 * stableCheap**3 *
         feesCheap**6 - 6 * basicCheap**2 * basicExpensive**4 * feesExpensive**2 * stableCheap**3 *
         feesCheap**6 - 2 * basicCheap**6 * feesExpensive**3 * stableCheap**3 * feesCheap**6 -
         6 * basicCheap**5 * basicExpensive * feesExpensive**3 * stableCheap**3 * feesCheap**6 -
         6 * basicCheap**4 * basicExpensive**2 * feesExpensive**3 * stableCheap**3 * feesCheap**6 -
         2 * basicCheap**3 * basicExpensive**3 * feesExpensive**3 * stableCheap**3 * feesCheap**6 +
         cmath.sqrt(
             (-2 * basicCheap**3 * basicExpensive**3 * stableCheap**3 * feesCheap**3 -
              3 * basicCheap**2 * basicExpensive**4 * stableCheap**3 * feesCheap**3 +
              3 * basicCheap * basicExpensive**5 * stableCheap**3 * feesCheap**3 + 2 *
              basicExpensive**6 * stableCheap**3 * feesCheap**3 + 3 * basicCheap**3 *
              basicExpensive**3 * feesExpensive * stableCheap**3 * feesCheap**3 + 12 *
              basicCheap**2 * basicExpensive**4 * feesExpensive * stableCheap**3 * feesCheap**3 +
              3 * basicCheap * basicExpensive**5 * feesExpensive * stableCheap**3 * feesCheap**3 +
              3 * basicCheap**3 * basicExpensive**3 * feesExpensive**2 * stableCheap**3 *
              feesCheap**3 - 3 * basicCheap**2 * basicExpensive**4 * feesExpensive**2 *
              stableCheap**3 * feesCheap**3 - 2 * basicCheap**3 * basicExpensive**3 *
              feesExpensive**3 * stableCheap**3 * feesCheap**3 +
              3 * basicCheap**3 * basicExpensive**3 * stableCheap**3 * feesCheap**4 -
              3 * basicCheap**2 * basicExpensive**4 * stableCheap**3 * feesCheap**4 -
              12 * basicCheap * basicExpensive**5 * stableCheap**3 * feesCheap**4 - 6 *
              basicExpensive**6 * stableCheap**3 * feesCheap**4 + 3 * basicCheap**4 *
              basicExpensive**2 * feesExpensive * stableCheap**3 * feesCheap**4 - 15 * basicCheap**
              3 * basicExpensive**3 * feesExpensive * stableCheap**3 * feesCheap**4 - 30 *
              basicCheap**2 * basicExpensive**4 * feesExpensive * stableCheap**3 * feesCheap**4 -
              12 * basicCheap * basicExpensive**5 * feesExpensive * stableCheap**3 * feesCheap**4 -
              12 * basicCheap**4 * basicExpensive**2 * feesExpensive**2 * stableCheap**3 *
              feesCheap**4 - 15 * basicCheap**3 * basicExpensive**3 * feesExpensive**2 *
              stableCheap**3 * feesCheap**4 - 3 * basicCheap**2 * basicExpensive**4 *
              feesExpensive**2 * stableCheap**3 * feesCheap**4 + 3 * basicCheap**4 *
              basicExpensive**2 * feesExpensive**3 * stableCheap**3 * feesCheap**4 +
              3 * basicCheap**3 * basicExpensive**3 * feesExpensive**3 * stableCheap**3 *
              feesCheap**4 + 18 * basicCheap**3 * basicExpensive**3 * stableCheap**2 *
              stableExpensive * feesCheap**4 + 27 * basicCheap**2 * basicExpensive**4 *
              stableCheap**2 * stableExpensive * feesCheap**4 + 9 * basicCheap *
              basicExpensive**5 * stableCheap**2 * stableExpensive * feesCheap**4 +
              45 * basicCheap**4 * basicExpensive**2 * feesExpensive * stableCheap**2 *
              stableExpensive * feesCheap**4 + 72 * basicCheap**3 * basicExpensive**3 *
              feesExpensive * stableCheap**2 * stableExpensive * feesCheap**4 +
              27 * basicCheap**2 * basicExpensive**4 * feesExpensive * stableCheap**2 *
              stableExpensive * feesCheap**4 + 27 * basicCheap**5 * basicExpensive *
              feesExpensive**2 * stableCheap**2 * stableExpensive * feesCheap**4 +
              45 * basicCheap**4 * basicExpensive**2 * feesExpensive**2 * stableCheap**2 *
              stableExpensive * feesCheap**4 + 18 * basicCheap**3 * basicExpensive**3 *
              feesExpensive**2 * stableCheap**2 * stableExpensive * feesCheap**4 +
              3 * basicCheap**3 * basicExpensive**3 * stableCheap**3 * feesCheap**5 +
              12 * basicCheap**2 * basicExpensive**4 * stableCheap**3 * feesCheap**5 +
              15 * basicCheap * basicExpensive**5 * stableCheap**3 * feesCheap**5 + 6 *
              basicExpensive**6 * stableCheap**3 * feesCheap**5 + 6 * basicCheap**4 *
              basicExpensive**2 * feesExpensive * stableCheap**3 * feesCheap**5 + 27 * basicCheap**
              3 * basicExpensive**3 * feesExpensive * stableCheap**3 * feesCheap**5 + 36 *
              basicCheap**2 * basicExpensive**4 * feesExpensive * stableCheap**3 * feesCheap**5 +
              15 * basicCheap * basicExpensive**5 * feesExpensive * stableCheap**3 * feesCheap**5 +
              3 * basicCheap**5 * basicExpensive * feesExpensive**2 * stableCheap**3 *
              feesCheap**5 + 18 * basicCheap**4 * basicExpensive**2 * feesExpensive**2 *
              stableCheap**3 * feesCheap**5 + 27 * basicCheap**3 * basicExpensive**3 *
              feesExpensive**2 * stableCheap**3 * feesCheap**5 + 12 * basicCheap**2 *
              basicExpensive**4 * feesExpensive**2 * stableCheap**3 * feesCheap**5 + 3 *
              basicCheap**5 * basicExpensive * feesExpensive**3 * stableCheap**3 * feesCheap**5 +
              6 * basicCheap**4 * basicExpensive**2 * feesExpensive**3 * stableCheap**3 *
              feesCheap**5 + 3 * basicCheap**3 * basicExpensive**3 * feesExpensive**3 *
              stableCheap**3 * feesCheap**5 - 9 * basicCheap**3 * basicExpensive**3 *
              stableCheap**2 * stableExpensive * feesCheap**5 - 18 * basicCheap**2 *
              basicExpensive**4 * stableCheap**2 * stableExpensive * feesCheap**5 -
              9 * basicCheap * basicExpensive**5 * stableCheap**2 *
              stableExpensive * feesCheap**5 - 18 * basicCheap**4 * basicExpensive**2 *
              feesExpensive * stableCheap**2 * stableExpensive * feesCheap**5 -
              36 * basicCheap**3 * basicExpensive**3 * feesExpensive * stableCheap**2 *
              stableExpensive * feesCheap**5 - 18 * basicCheap**2 * basicExpensive**4 *
              feesExpensive * stableCheap**2 * stableExpensive * feesCheap**5 - 9 * basicCheap**5 *
              basicExpensive * feesExpensive**2 * stableCheap**2 * stableExpensive * feesCheap**5 -
              18 * basicCheap**4 * basicExpensive**2 * feesExpensive**2 * stableCheap**2 *
              stableExpensive * feesCheap**5 - 9 * basicCheap**3 * basicExpensive**3 *
              feesExpensive**2 * stableCheap**2 * stableExpensive * feesCheap**5 -
              2 * basicCheap**3 * basicExpensive**3 * stableCheap**3 * feesCheap**6 -
              6 * basicCheap**2 * basicExpensive**4 * stableCheap**3 * feesCheap**6 -
              6 * basicCheap * basicExpensive**5 * stableCheap**3 * feesCheap**6 - 2 *
              basicExpensive**6 * stableCheap**3 * feesCheap**6 - 6 * basicCheap**4 *
              basicExpensive**2 * feesExpensive * stableCheap**3 * feesCheap**6 - 18 *
              basicCheap**3 * basicExpensive**3 * feesExpensive * stableCheap**3 * feesCheap**6 -
              18 * basicCheap**2 * basicExpensive**4 * feesExpensive * stableCheap**3 *
              feesCheap**6 - 6 * basicCheap * basicExpensive**5 * feesExpensive * stableCheap**3 *
              feesCheap**6 - 6 * basicCheap**5 * basicExpensive * feesExpensive**2 *
              stableCheap**3 * feesCheap**6 - 18 * basicCheap**4 * basicExpensive**2 *
              feesExpensive**2 * stableCheap**3 * feesCheap**6 - 18 * basicCheap**3 *
              basicExpensive**3 * feesExpensive**2 * stableCheap**3 * feesCheap**6 -
              6 * basicCheap**2 * basicExpensive**4 * feesExpensive**2 * stableCheap**3 *
              feesCheap**6 - 2 * basicCheap**6 * feesExpensive**3 * stableCheap**3 * feesCheap**6 - 6 *
              basicCheap**5 * basicExpensive * feesExpensive**3 * stableCheap**3 * feesCheap**6 -
              6 * basicCheap**4 * basicExpensive**2 * feesExpensive**3 * stableCheap**3 *
              feesCheap**6 - 2 * basicCheap**3 * basicExpensive**3 * feesExpensive**3 *
              stableCheap**3 * feesCheap**6)**2 + 4 *
             (3 * (basicExpensive**2 * stableCheap**2 +
                   basicCheap * basicExpensive * stableCheap**2 * feesCheap +
                   2 * basicExpensive**2 * stableCheap**2 * feesCheap + basicCheap *
                   basicExpensive * feesExpensive * stableCheap**2 * feesCheap - basicCheap *
                   basicExpensive * stableCheap * stableExpensive * feesCheap) *
              (basicCheap * basicExpensive * feesCheap**2 + basicExpensive**2 * feesCheap**2 +
               basicCheap**2 * feesExpensive * feesCheap**2 +
               basicCheap * basicExpensive * feesExpensive * feesCheap**2) -
              (basicCheap * basicExpensive * stableCheap * feesCheap +
               2 * basicExpensive**2 * stableCheap * feesCheap +
               basicCheap * basicExpensive * feesExpensive * stableCheap * feesCheap + basicCheap *
               basicExpensive * stableCheap * feesCheap**2 + basicExpensive**2 *
               stableCheap * feesCheap**2 + basicCheap**2 * feesExpensive * stableCheap * feesCheap**2 +
               basicCheap * basicExpensive * feesExpensive * stableCheap * feesCheap**2)**2)**3)
         )**(1 / 3)

print(x.real)

