setup.externalCodeURLs ??= {};
setup.externalCodePromises ??= {};

setup.externalCodePromise = (promiseID: string)=>{
	if(!setup.externalCodeURLs[promiseID])
		return Promise.resolve();
	setup.externalCodePromises[promiseID] ??= Promise.all(
		[
			importScripts(setup.externalCodeURLs[promiseID].code as unknown as string), // Casting to unknown because of a weird bug in the types
			importStyles(...setup.externalCodeURLs[promiseID].style),
		]
	);
	return setup.externalCodePromises[promiseID];
}
