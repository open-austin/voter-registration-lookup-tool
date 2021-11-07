# Voter Registration Lookup Tool (VRLT)

Website: https://voterlookup.ballotapi.org/

This website allows people interacting with League of Women Voters Austin Area (LWV-AA) volunteers to quickly look up their voter registration status and details.

It is a collaboration between the [LWV-AA](https://lwvaustin.org/) and [OpenAustin](https://www.open-austin.org/) (a brigade of [Code for America](https://brigade.codeforamerica.org/)).

## Project status

Status: **In Development**

See our [github issues](https://github.com/open-austin/voter-registration-lookup-tool/issues) for the specific things we're working on.

## Background

Often at LWV-AA voter registration booths, when someone passes by and we ask if they are registered to vote and have their address up-to-date, they don't know.

Unfortunately, we didn't know either, so we would pull out our personal laptops and phones and try to find them on the county or state voter lookup website (e.g. [votetravis.com](https://www.votetravis.com/vexpress/display.do)).

This wasn't ideal since:
* The county and state voter lookup websites were designed to be used in quite settings, not a loud public booth while standing.
* The voter is entering private information into a volunteer's personal laptop/phone, which may not be fully cleared when they're done.
* Austin has many surrounding cities the cross county boundaries, so some people are not sure which county they are in, which means having to try to manually look them up in multiple counties.

## What this website does

This website acts as a voter lookup "kiosk", where people can quickly and easily find their voter registration status and details (such as current registered address).

That way, if they need to change something (such as updating their address), a LWV-AA volunteer voter deputy registrar (VDR) can help them right then and there.

## How this website works

1. A voter searches for their county by entering their address or selecting their county from a dropdown.
2. They then enter their name and birth date or drivers license number to look up their registration.
3. Their current registration status and address are displayed on the screen, so they can make sure everything is up-to-date.
4. When done, they can clear the screen for the next user.

## Privacy

The website uses a browser extension that queries the state and county websites with the voter's entered information, then parses and returns the results to the page.

The website itself is statically hosted, and just uses the browser extension to query for voter registration information, which only communicates with state and county voter lookup websites.

This means that no voter information is ever sent to any server except the state and county websites, and no voter lookup information is logged or retained by the LWV-AA.

After someone is done using it and clears their information, we have no record of that lookup or know what voter looked up their status.

Our goal is to make it easy for someone to check their status and address, not capture data.

## Contributing

This project is maintained by a team at OpenAustin. If you'd like to contribute, join `#p-voter-lookup` on [OpenAustin's Slack](https://slack.open-austin.org/).

NOTE: To participate or contribute to this project, you must abide by OpenAustin's [Code of Conduct](https://www.open-austin.org/about/#code-of-conduct).

## License

This project is open-source under the MIT license, including the website (`/docs`), browser extension (`/extension`), and SDK (`/sdk`).

Any organization logos and names (e.g. LWV-AA) are copyrights and/or trademarks of their respective owners. So if you fork/clone this project, before you publish your version publicly, you need to either remove the various organization logos and names or get their permission in writing to use them.

