//https://stackoverflow.com/a/33616981/7200161

function interceptClickEvent(e) {

    
    var href;
    var target = e.target || e.srcElement;

    if (target.tagName === 'A') {
        href = target.getAttribute('href');
    }
    else{
         target = target.closest('a');
         if(target)
            href = target.getAttribute('href');
    }

    if(href){
        href = href.trim();
        const execPrefix = "exec:";
        if (href.startsWith(execPrefix)) {
            const qspcode = href.substring(execPrefix.length);
            const twineCode = setup.qsrc2tw(qspcode);
            console.log("EXEC:",twineCode);
            try{
                $(".passage").wiki(twineCode);
            }
            finally{
                e.preventDefault();
            }
        }
    }
}


//listen for link click events at the document level
if (document.addEventListener) {
    document.addEventListener('click', interceptClickEvent);
} else if (document.attachEvent) {
    document.attachEvent('onclick', interceptClickEvent);
}