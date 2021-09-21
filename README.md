# Magic Mirror aka Merlin Mirror

![Logo V1-01](https://user-images.githubusercontent.com/13379750/134212920-624e3ac3-b670-4d3a-a513-2873acec394a.jpg)


Together we (the [ZCollective](https://www.zollective.de) wanted to build an affordable "magic mirror". A magic mirror is a device that functions like a standard mirror, with the addition of displaying information to the "user" of said mirror. Information displayed can include calendar information, local weather, local time or news and a fact of the day.

# Features  & Showcase:

![IMG-20200128-WA0003](https://user-images.githubusercontent.com/13379750/134216772-f8997671-e3de-46b1-9827-6ba74ddaffd2.jpg)


## Calendar
To the left is the option of integrating a google calendar. This will then show upcoming appointments and provides a preview for up to 8 individual appointments.

## Time
In the middle top is a time display, including the current date. Very simple.

## Weather
On the top right is a weather panel, which shows the current weather, temperature and windspeed. As well as the location it displays the weather for. Directly below is a forecast for the next five days with the temperature and weather to be expected.

## Fact & News
Below the weather panel is a news panel which cycles through the top ten news headlines of the last hour. Additionally it shows a random fact of the day.


# Hardware:

The Mirror hardware consists of 3 main pieces:

## The Screen:
Initially we repurposed an old computer screen, however this proved to be unsatisfactory as the screens was too thick to fit comfortable within 3 cm thickness we wanted to achieve with the mirror.
We found and ordered test screens (lcd panels, driver board and control board) from a supplier which had the required thickness.

The screens are 24inch diagonal, and have a Full-HD resolution

## The mirror & Frame
To display information through a mirror a special type of glass is required, so called two-way-mirrors glas. This will allow light to pass through from behind the mirror, while reflecting light shining from the other surface. Generally light will pass through from the brighter to the darker side.

To mount the glass, screen and other hardware we build a wooden backplate, with cutouts for the Screen.

## Compute & Human sensing
To fulfil the compute needs and display information on the mirror we went for the obvious choice of hobbyists worldwide: The Raspberry PI. We experimented with BananaPi and other derivatives, but it turned out the Raspberry is the easiest to use.
Additionally we needed to find a way to detect a human presence, as we wanted the screen to shutoff when noone was there. Initially we went with Passive PIR sensors reacting to body heat. However this would not work through the glass and looks ugly poking out above or below the glass. We settled on activemicrowave sensing, which manages to detect motion within a 5-7 meter radius.

# Future Plans:
Even though we have our current prototypes working, we want to improve the hardware, design and technology behind the mirror to make it more affordable. The concrete areas we need to work on are:

* Switch to cheaper hardware, Raspberry PIs are quite expensive
* Redo the UI to flow better, and run on slower hardware. Maybe re-implement for QT embeddded?
* Create a Lifestyle version of the mirror typically used as clothing mirros.
