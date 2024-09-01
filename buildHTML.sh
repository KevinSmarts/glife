LOCATIONS="$(pwd)/locations"

pushd "$1" > /dev/null

cd ./qsrc2tw/tools/QSRC2TW

./qsrc2tw -in "$LOCATIONS" -out "../../twine-code"

cd ../..

if which node > /dev/null
	then
		npx tsc
		npx esbuild "temp/typescript.js" --minify --outfile="twine-code/-generatedFromTW/typescript-min.js"
	else
		echo "Node could not be found"

fi

popd > /dev/null

./qsrc2tw/tools/tweeGo/tweego_nix64 --head "./qsrc2tw/twine-code/misc/head.txt" -o "./glife.html" "./qsrc2tw/twine-code"
