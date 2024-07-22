import qsrc2tw from './qsrc2tw.js';
import md5 from './misc/md5.js';

setup.md5 = (code) => md5(code);

setup ??= {}
setup.qsrc2tw = (code) => { 
    setup.qsrc2tw_cached ??= {};
    const id = md5(code);
    if(!setup.qsrc2tw_cached[id])
        setup.qsrc2tw_cached[id] = qsrc2tw(code);
    return setup.qsrc2tw_cached[id];
    
}