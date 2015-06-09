module Levels.Chapter2 where

import Data.Array
import Data.Maybe
import qualified Data.StrMap as SM

import Helper
import Transformer
import Types

chapter2 :: Chapter
chapter2 = {
    name: "Chapter 2",

    transformers: SM.fromList [
        "mapYtoYR" :> {
            name: "map {Yellow}↦{Yellow}{Red}",
            function: replaceMultiple Yellow [Yellow, Red]
        },
        "mapCtoRC" :> {
            name: "map {Cyan}↦{Red}{Cyan}",
            function: replaceMultiple Cyan [Red, Cyan]
        },
        "rejectY" :> {
            name: "map (reject {Yellow})",
            function: map (reject (== Yellow)) >>> clearEmpty
        },
        "rejectC" :> {
            name: "map (reject {Cyan})",
            function: map (reject (== Cyan)) >>> clearEmpty
        },
        "filterContainsR" :> {
            name: "filter (contains {Red})",
            function: filter (\stack -> Red `elemIndex` stack /= -1) >>> clearEmpty
        },
        "mapPushR" :> {
            name: "map (stack {Red})",
            function: map (`snoc` Red)
        },
        "mapReverse" :> {
            name: "map reverse",
            function: map reverse
        }
    ],

    levels: SM.fromList [
        "2.1" :> {
            name: "Mercury",
            difficulty: Medium,
            help: Nothing,
            initial: [[Red, Red], [Red, Yellow], [Cyan, Yellow], [Cyan, Cyan]],
            target: [[Red, Red], [Red, Red], [Red, Red], [Red, Red]]
        },
        "2.2" :> {
            name: "Venus",
            help: Nothing,
            difficulty: Easy,
            initial: [[Red, Red], [Red, Yellow], [Cyan, Yellow], [Cyan, Cyan]],
            target: [[Red, Red], [Red, Red]]
        },
        "2.3" :> {
            name: "Earth",
            help: Nothing,
            difficulty: Easy,
            initial: [[Cyan, Cyan, Yellow], [Cyan, Red], [Cyan, Red], [Cyan, Cyan, Yellow]],
            target: [[Red, Cyan, Cyan], [Red, Cyan], [Red, Cyan], [Red, Cyan, Cyan]]
        },
        "2.4" :> {
            name: "Mars",
            help: Nothing,
            difficulty: Easy,
            initial: [[Red, Red], [Red, Yellow], [Cyan, Yellow], [Cyan, Cyan]],
            target: [[Red, Red, Red], [Red, Yellow, Red], [Red, Yellow, Red], [Red, Red, Red]]
        }
    ]
}