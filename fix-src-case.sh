#!/usr/bin/env bash
# fixes image src casing, so thing aren't broken on case-sensitive file systems (Linux)
# requirements: linux (GNU coreutils), ripgrep, latest images in images/

exact_fix() {
    # fixes when src uses exact path, but incorrect casing
    images="$(find ./images -type f)"

    IFS=$'\n'
    for image in $images; do
        actual="${image:2}"
        echo "exact_fix: ${actual}"
        rg -il --type-add 'qsrc:*.qsrc' -tqsrc "${actual}" \
            | xargs -I {} sed -i -e "s|${actual}|${actual}|gI" '{}'
    done
}

subdir_fix() {
    # fixes subdirectory casings, when src uses variables
    # more a failsafe, since var_fix might have edge cases
    images="$(find ./images -type d | sed -e 's|$|/|')"

    IFS=$'\n'
    for image in $images; do
        actual="${image:2}"
        echo "subdir_fix: ${actual}"
        rg -il --type-add 'qsrc:*.qsrc' -tqsrc "${actual}" \
            | xargs -I {} sed -i -e "s|${actual}|${actual}|gI" '{}'
    done
}

var_fix() {
    # tries to fix casing when src uses variables
    # example:
    # images/locations/pavlovsk/resident/apartment/aptrolan/guavacoco'+rand(0,2)+'.jpg
    # images/characters/pavlovsk/school/girl/natasha/natsleep<<rand(1,4)>>.jpg
    images="$(find images -type f | grep -e '[0-9]\.[A-Za-z]*$' | sed -e 's|\(.*/\)\([^0-9]*\).*|\1\2|' -e '/\/$/d' | sort -u)"

    IFS=$'\n'
    for image in $images; do
        actual="${image}'"
        echo "var_fix: ${actual}"
        rg -il --type-add 'qsrc:*.qsrc' -tqsrc "${actual}" \
            | xargs -I {} sed -i -e "s|${actual}|${actual}|gI" '{}'

        actual="${image}<<"
        echo "var_fix: ${actual}"
        rg -il --type-add 'qsrc:*.qsrc' -tqsrc "${actual}" \
            | xargs -I {} sed -i -e "s|${actual}|${actual}|gI" '{}'
    done
}


var_fix
subdir_fix
exact_fix

echo "Done!"
