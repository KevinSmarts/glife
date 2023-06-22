
## Call Validator Readme

The `callvalidator.py` is a simple python script that tries to find out whether a call (`gt 'location', :p`) is valid or not.

A call is valid if the `location` exists and there is at least one `if $ARGS[0] = :p` or `if ARGS[0] = :p` or similar code present in the `location`’s code. In other words, the call won’t result in a `“Location doesn’t exist”` error.

As QSP doesn’t provide a standard way to handle these calls - `$ARGS[0]` can used simple as `$value = $ARGS[0]` - there is no way to make this 100% correct.  
Nonetheless I tried to cover as many scenarios as I could.

Even with this currently two files are skipped: `boyStat.qsrc` and `exp_gain.qsrc` as there is no easy to decide whether a value passed in `$ARGS[0]` or `ARGS[0]` is valid or not.

### Running the script

The script can be run with `python callvalidator.py soure=<folder> [file=<filename> | list=<listfilename>] [folder=<folder>]`

1. Calling `python callvalidator.py source=locations` will run the validator on every `.qsrc` file in the `locations` folder.
2. Calling `python callvalidator.py source=locations file=albina_wine_event.qsrc` will run the validator against the `albina_wine_event.qsrc` file and because no `folder=<folder>` parameter is specified it will assume that the file is in the folder specified by `source=locations`.
3. Calling `python callvalidator.py source=locations file=albina_wine_event.qsrc folder=workfolder` will look for the `albina_wine_event.qsrc` file in the `workfolder` folder and will check the calls made in the file against the files in the `locations` folder.
4. Calling `python callvalidator.py source=locations list=listoffiles.txt` will read the `listoffiles.txt` file and will validate every file that is listed. If the `folder` parameter is not passed, it will for `listoffiles.txt` in the folder defined by `source`, i.e. in the `locations` folder. If the `folder` parameter is passed, then the validator will look for `listoffiles.txt` in that folder.
5. the `file=` and `list=` parameters can’t be used at the same time (at the moment).

### File list files

The files that can be passed in the `list=<listfilename>` have to conform to one of two forms:

#### Simple text file

The simplest is a simple text file  
Just add the file names (one per line) and optionally the folder, separated by `;`

```
alexandriaEv.qsrc
albina_wine_event.qsrc;locations
```

If the validator finds any lines that don’t match this expectation it will quit with an error.  
The validator can’t check whether the filename or the folder name is valid and if it receives something like
```
albina_\I'm_funn.qsrc;loc:ations
```
It will simply blow up.  
I will add some checks to avoid this, but right now it will just exit with an error.

#### XML File

The XML file is a bit more complicated, and know the same:

```xml
<?xml version="1.0" encoding="utf-8"?>
<FileList>
	<Structure>
		<File name="alexandriaEv.qsrc" folder="locations"/>
		<File name="albina_wine_event.qsrc" folder="locations"/>
		<File name="alex.qsrc" folder="locations"/>
		<File name="dimaEv.qsrc" folder="locations"/>
	</Structure>
</FileList>
```

Every file goes into a `<File>` tag with two attributes: `name` and `folder`.  
In the XML file both are mandatory, so the `folder` must be specified unlike in the text file.

### Interpreting the output

```jsx
----- Summary -----
  Locations called incorrectly    : 010 // The number of invalid 'location', :p pairs that don't exist
  Non-existing locations called   : 002 // The location called doesn't exists
  Number of incorrect calls       : 019 // The total number of incorrect calls made to invalid 
                                        // 'location', :p pairs 
  Locations making incorrect calls: 003 // The number of locations calling invalid 'location', :p pairs  
  Locations never called          : 000 // Only shows up when the whole locations folder is checked,
                                        // the number of locations that do exist, but no one calls them. 

----- Validated files ----- 
//the list of files that were validated. 
//Only shown when the validator is run with a validation list file as the input.
  locations\alexandriaEv.qsrc
  locations\albina_wine_event.qsrc
  locations\alex.qsrc
  locations\dimaEv.qsrc
  locations\uni_dorm.qsrc
  locations\volleyball.qsrc

----- List of Invalid calls -----  
// a list of all the invalid 'location', :p pairs that were called.
// the structure is: 'location', :p  : the reason the pair is invalid.

  'albina_dorm', 'start' : albina_dorm.qsrc doesn't exist.

  'albina_wine_event', 'shave_answer3' : No $ARGS[0] or ARGS[i] expecting 'shave_answer3'

  'defeat', ''	: defeat.qsrc doesn't exist.

  'victory', ''	: victory.qsrc doesn't exist.

  'volleyball', 'collapse'	: No $ARGS[0] or ARGS[i] expecting 'collapse'
  'volleyball', 'drive_back'	: No $ARGS[0] or ARGS[i] expecting 'drive_back'
  'volleyball', 'fake_spike'	: No $ARGS[0] or ARGS[i] expecting 'fake_spike'
  'volleyball', 'practice_end2'	: No $ARGS[0] or ARGS[i] expecting 'practice_end2'
  'volleyball', 'receive1'	: No $ARGS[0] or ARGS[i] expecting 'receive1'
  'volleyball', 'recieve_practice'	: No $ARGS[0] or ARGS[i] expecting 'recieve_practice'


----- List of Locations and invalid calls they make  

// All the locations that made invalid calls, with a list of the calls they made.
// The structure is
// ---- location name [the file of the location]:  In case the same location name is used in more than one file
//   line number, type of call 'location', :p : the reason the pair is invalid.

  ---- albina_wine_event [locations\albina_wine_event.qsrc]:
    invalid call on line 0176: gs 'albina_wine_event', 'shave_answer3'	: No $ARGS[0] or ARGS[i] expecting 'shave_answer3
    
  ---- uni_dorm [locations\uni_dorm.qsrc]:
    invalid call on line 0222: gs 'albina_uni_schedule', ''	: albina_uni_schedule.qsrc doesn't exist.
    invalid call on line 0236: gt 'albina_dorm', 'start'	: albina_dorm.qsrc doesn't exist.

  ---- volleyball [locations\volleyball.qsrc]: 
    invalid call on line 0136: gt 'volleyball', 'recieve_practice'	: No $ARGS[0] or ARGS[i] expecting 'recieve_practice'
    invalid call on line 0230: gt 'volleyball', 'practice_end2'	: No $ARGS[0] or ARGS[i] expecting 'practice_end2'
    invalid call on line 0250: gt 'volleyball', 'practice_end2'	: No $ARGS[0] or ARGS[i] expecting 'practice_end2'
    invalid call on line 0260: gt 'volleyball', 'practice_end2'	: No $ARGS[0] or ARGS[i] expecting 'practice_end2'
    invalid call on line 0264: gt 'volleyball', 'practice_end2'	: No $ARGS[0] or ARGS[i] expecting 'practice_end2'
    invalid call on line 0270: gt 'volleyball', 'practice_end2'	: No $ARGS[0] or ARGS[i] expecting 'practice_end2'
    invalid call on line 0310: gt 'volleyball', 'practice_end2'	: No $ARGS[0] or ARGS[i] expecting 'practice_end2'
    invalid call on line 0334: gt 'volleyball', 'practice_end2'	: No $ARGS[0] or ARGS[i] expecting 'practice_end2'
    invalid call on line 0372: gt 'volleyball', 'receive1'	: No $ARGS[0] or ARGS[i] expecting 'receive1'
    invalid call on line 0430: gt 'victory', ''	: victory.qsrc doesn't exist.
    invalid call on line 0432: gt 'defeat', ''	: defeat.qsrc doesn't exist.
    invalid call on line 0434: gt 'volleyball', 'player_substitution'	: No $ARGS[0] or ARGS[i] expecting 'player_substitution'
    invalid call on line 0436: gt 'volleyball', 'collapse'	: No $ARGS[0] or ARGS[i] expecting 'collapse'
    invalid call on line 0481: gt 'volleyball', 'drive_back'	: No $ARGS[0] or ARGS[i] expecting 'drive_back'
    invalid call on line 0494: gt 'volleyball', 'drive_back'	: No $ARGS[0] or ARGS[i] expecting 'drive_back'
    invalid call on line 0642: gs 'volleyball', 'fake_spike'	: No $ARGS[0] or ARGS[i] expecting 'fake_spike'

----- List of Locations that are never called -----
//  A list of all the locations that do exist, but no call is made to them. 
//  Only shows up when a whole folder is checked, not when a single file or a list of files is passed.
  
```

### How does it work

It is fairly rudimentary at the moment.  
The validator loads the files that we want to validate (every file in the folder, the files defined in the list or the file that was passed as a parameter), and finds every `gs|gt|xgs|xgt 'location', :p` occurrence, and builds a list of files to check - `location.qsrc`.

>One issue with this currently is that if there is a `location` where the related file is not `location.qsrc` but `somethingelse.qsrc` then it won’t be checked.

In the next step it loads every file from the list.  
If a file doesn’t exist then every call to that `location` will be marked `<location>.qsrc doesn't exist.`  
If the file exists the validator checks if there are any lines containing `args[0]=:p`, `$if$args[0]=:p`, `args[i]=:p` or `$args[0]=:p` .  
If a line is found, and the line starts with `if $args`, `if args`, `elseif args` or `elseif $args` it will mark the call as valid.  
Lines starting with `!`, i.e. comment lines, are ignored, and lines that are placed `!{` and `}`, i.e. block comments, are ignored too.  
Any call where the `location` exists, but no lines are found in the above step will be marked with `No $ARGS[0] or ARGS[i] expecting :p`

Finally, the validator generates a report file, naming following the pattern of `call_validity [<folder>|<file>|<listfile>] - YYYYMMDDhhmmss`, for example: `call_validity [filesToValidate.txt] - 20230622135554.txt`
