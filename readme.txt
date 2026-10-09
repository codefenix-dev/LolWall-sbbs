LolWall (Local Oneliner Wall)
Version 0.260502

by Craig Hendricks
codefenix@conchaos.synchro.net

ConstructiveChaos BBS:
  https://conchaos.synchro.net
 telnet://conchaos.synchro.net
    ssh://conchaos.synchro.net



Description:

  This is a simple local one-liner wall for Synchronet BBS.
  Wall posts are shown with an animated fade-in effect. Pipe
  code colors are allowed.  



Instructions:

 1. Extract the contents of the ZIP file to /sbbs/xtrn/lolwall
 
 2. Add to SCFG -> External Programs-> Online Programs (Doors):

    Name                     Local Oneliner Wall
    Internal Code            LOLWALL
    Start-up Directory       ../xtrn/lolwall
    Command Line             ?lolwall.js
    Execution Requirements   ANSI
    Execute on Event         Logon    <--Optional   

    If you want to show it during logon, you can set "Execute on Event"
    to "Logon", but be sure to answer "No" to the "Execute on Event Only"
    prompt that follows, otherwise users won't be able to select it from
    the External Programs menu.
    
    If you want to add an option to a command shell menu, you can 
    modify your command shell script with something similar to this.
    
    'O': { eval: 'bbs.exec("?../xtrn/lolwall/lolwall.js")' },
    
    This is assuming you're using the newer JavaScript command shell style.

 3. If you don't like the graffiti appearance of the wall, you can edit the 
    included lolwall.msg file to your liking in PabloDraw.
	
 4. Edit the settings in lolwall.ini to your liking. All the available
    options are described within this file.
 


Usage:

  Wall posts get stored to a file named lolwall.dat. The first time the wall
  is ran, or if the lolwall.dat file is missing, a default message will be 
  shown to the user, inviting them to post something to the wall.
  
  The lolwall.dat file will contain everything ever posted to the wall, but
  only the last 14 will be displayed to the wall.
  
  If at any time you feel the need to reset the wall, simply delete or rename
  lolwall.dat, and a new one will be generated the next time someone posts 
  something.
   


Background and purpose:

  This was one of my first custom JavaScripts for Synchronet. At the time,
  I wanted a basic one liner wall that didn't rely on remote sources in order
  to work, and didn't have lengthy credit screens after running. I also used it
  as an opportunity to try different things to have fun with it, like fading
  in the text as each line gets displayed.
  
  I've been using it since 2021 on my own BBS, making slight modifications to
  it over time.
  
  Hope you enjoy!
    


Version History:  

v 0.260502 - May 2, 2026:
   
 + lolwall.ini config file added with several easily configurable options, if
   this file is not present, lolwall loads a set of default options.

 + Twit list added. Twits have view-only access and aren't given the option to
   post anything. Thanks to xbit for the suggestion!


v 0.250624 - June 6, 2025:

 + Control characters are now stripped out of messages before they get posted 
   to the wall. This is to prevent messages containing potentially malicious 
   character sequences from getting displayed.

 + Removed the console.down calls, since they were relics of an ancient
   version of the script and no longer did anything in the present version,
   and also caused unintended screen pauses in Synchronet 3.21+.
 

v 0.250412 - April 12, 2025:
 
 + Greatly enhanced the text-entry screen, showing a live preview
   of the text while typing it, accounting for pipe-color codes. 
   In addition, pipe-color codes no longer count toward the 
   overall length of the text to be posted.
   
 + Default message for nonexistent lolwall.dat file.


2021:

 + Initial version. Ran for a long time as a private project, changing
   it little by little over time.
