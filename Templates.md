# Templates  
Templates should serve as patterns and also as skeletons for developers to allow them to code faster and to keep the common style of handling of events.

## Location  
For this article, the Location means an area in which the program goes through the instruction "GOTO 'Name of Location'". Let me also set up the term Sublocation, where the program goes through the instruction "GOTO 'Name of Location','Name of Sublocation'. The rules for both of them are similar.

## Code example  
```
# Name of Location
!! CLOSE ALL stops playing all the sounds
CLOSE ALL

!! $location_type is set quite often, but tested is rarely
! $location_type = 'private'
! $location_type = 'secluded'
! $location_type = 'public_indoors'
! $location_type = 'public_outdoors'
! $location_type = 'bathroom'
! $location_type = 'indoors'
! $location_type = 'Sonia Bathroom' ????

!! The following variables allow the proper return from universal routines.
!! $loc and $CURLOC contain 'Name of Location'
!! $metka and $ARGS[0] contain 'Name of Sublocation'
$loc = $CURLOC
$metka = $ARGS[0]

!! the alternate way is to fill the variables straight with the desired values
$loc = 'name of Location'
$metka = 'name of sublocation'

!! some locations can have their own noise, but you should allow to mute it.
if sound = 0:PLAY 'sound/korr.mp3',30

!! Rachels opinion
!! I think that the common code should be at the beginning of the file and it shouldn''t be too long
!! even the common room/place should be defined as a Sublocation

if $ARGS[0] = 'Name of Sublocation_Basic':
    program code
    ....
    act 'Leave Location': gt 'Name of Location','Leave'
end

if $ARGS[0] = 'Name of Sublocation_1':
    program code
    ....
    ....
end

if $ARGS[0] = 'Name of Sublocation_2':
    program code
    ....
    ....
end

if $ARGS[0] = 'Leave':
    program code
    killvar 'all local variables'
    gt 'higher-up Location'
end
!! The most important part is write the end of file - one dash is enough, but it looks better in this way:
--- Name of Location -------------------------------------

