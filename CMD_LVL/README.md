## Summary
This script calculates the potential level of commanders given their current xp.
The existing UI only shows the current level, not the potential level.

## Calculations for commander levels

```
XP for level n = ...
XP(n) = ...

0 -> 0
1 -> 10
    +20
2 -> 30
    +40
3 -> 70
    +60
4 -> 130
    +80
5 -> 210
    +100
6 -> 310
    +120
7 -> 430
    +140
8 -> 570
    +160
9 -> 730
    +180
10 -> 910
    +200
...

XP(0) = 0
XP(n) = 10 + XP(n - 1) + ((n - 1) * 20)
```
