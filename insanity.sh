#!/usr/bin/env bash

GREP="git --no-pager grep -n --color"

WARNING="\e[1;34m" # bold light blue
RESET="\e[0m"

_build_negative_match() {
    _output=""
    for arg in "$@"
    do
        output+=" --and --not -e \"${arg}\""
    done
}

notice() {
    echo -e "${WARNING}$1${RESET}"
}

notice 'Checking repeating words... (e.g. "voice voice")'
_build_negative_match " ha ha " " no no " " sweet sweet " " low low "\
                      " that that " " really really " " so so "\
                      " her her "
$GREP -e " \(\b[a-zA-Z][a-zA-Z]\+\) \1\b ""$output" -- locations/

notice 'Checking bad articles... (e.g. "a automatic" or "an color")'
$GREP -i -E "\Wa (a|e|i|o|u)." -- locations/ | grep -a -i -vE "\Wa (un|eu|us|ut|on|ur|in)."
notice "-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-"
$GREP -i -E "\Wan (b|c|d|f|g|j|k|l|m|n|p|q|r|s|t|v|w|x|y|z)\w+" -- locations/

notice 'Checking back tags... (e.g. "<<\$var><")'
$GREP -a -E '<<\$[^>]+><' -- locations/

notice 'Checking common typos... (e.g. "recieve")'
$GREP -i -a -E "\W(recieve|carress)" -- locations/
