// ==UserScript==
// @name         Commander Max Possible Level
// @namespace    https://github.com/Bobtron
// @version      1.0
// @description  Displays the possible level of a commander next to the actual level.
// @author       Bobtron
// @match        https://elgea.illyriad.co.uk/*
// ==/UserScript==

(function() {
    'use strict';

    let toggleState = localStorage.getItem('cmd_level_toggle') || 'off';

    function toggleTextBoxes() {
        if (toggleState === 'on') {
            toggleState = 'off';
            localStorage.removeItem('cmd_level_toggle');
        } else {
            toggleState = 'on';
            localStorage.setItem('cmd_level_toggle', 'on');
        }
    }

    // TODO: Make this function more efficient, to calculate the max possible level directly compared to calculating it in a loop.
    /*
    pepsi boy:  for level L<74: XP=10×(L^2 -L +1)
                for level L>75: XP=57250+100×(L-76)×(L-59)
    */
    function calculateMaxPossibleLevel(xp) {
        var level = 1;
        var xpNeeded = 10;
        while (xpNeeded <= xp && level < 74) {
            xpNeeded += 20 * level;
            level += 1;
        }
        while (xpNeeded <= xp) {
            level += 1;
            xpNeeded = 57250 + 100 * (level - 76) * (level - 59)
        }
        return level - 1;
    }

    // Appends the potential levels (in parentheses) to the end of the cell with the current level
    function addPotentialLevels() {
        if (toggleState === 'off') return;
        const commanderTable = document.querySelector("#MainContentDiv > div.info > div.accordionCommand.ui-accordion.ui-widget.ui-helper-reset.ui-accordion-icons")
        var xpCells = document.evaluate(".//h3/a/table/tbody/tr/td[5]", commanderTable, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        var levelCells = document.evaluate(".//h3/a/table/tbody/tr/td[6]", commanderTable, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

        // console.assert(xpCells.snapshotLength === levelCells.snapshotLength, "XP and Level snapshot lengths are unequal.");

        // snapshotItem returns Node that is also instance of Element
        for (var i = 0; i < xpCells.snapshotLength; i++) {
            var levelElem = levelCells.snapshotItem(i);
            if (levelElem.textContent.lastIndexOf(')') != -1) {
                continue;
            }
            var xpElem = xpCells.snapshotItem(i);
            var currXp = xpElem.textContent.substring(0, xpElem.textContent.indexOf('/'));

            var possibleLevel = calculateMaxPossibleLevel(Number(currXp));
            var currLevel = Number(levelElem.textContent);
            if (possibleLevel === currLevel) {
                continue;
            }

            levelElem.textContent = levelElem.textContent + ' (' + possibleLevel + ')';
            // 42px means the new level will be on same line (assuming double digit levels)
            levelElem.setAttribute('style', 'width:42px');
        }
    }

    // On toggle off, this function removes the potential level (in parentheses)
    function removePotentialLevels() {
        if (toggleState === 'on') return;
        const commanderTable = document.querySelector("#MainContentDiv > div.info > div.accordionCommand.ui-accordion.ui-widget.ui-helper-reset.ui-accordion-icons")
        var levelCells = document.evaluate(".//h3/a/table/tbody/tr/td[6]", commanderTable, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

        for (var i = 0; i < levelCells.snapshotLength; i++) {
            var levelElem = levelCells.snapshotItem(i);
            var parenPos = levelElem.textContent.indexOf('(');
            if (parenPos != -1) {
                levelElem.textContent = levelElem.textContent.substring(0, parenPos - 1);
                // 30px is original width
                levelElem.setAttribute('style', 'width:30px')
            }
        }
    }

    // Draws the toggle button for this commander level script. Taken from other Bazoon scripts
    function drawToggleButton() {
        const existingToggleButton = document.querySelector('div[cmd-level-toggle-button="true"]');
        if (!existingToggleButton) {
            const toggleButton = document.createElement('div');
            toggleButton.textContent = 'LVL';
            toggleButton.style.position = 'absolute';
            toggleButton.style.top = '175px';
            toggleButton.style.left = '690px';
            toggleButton.style.backgroundColor = 'rgba(255, 0, 0, 0.0)';
            if (toggleState === 'on') {
                toggleButton.style.color = '#804e06';
            } else {
                toggleButton.style.color = 'rgba(255, 0, 0, 1.0)';
            }
            toggleButton.style.border = '1px solid #804e06';
            toggleButton.style.cursor = 'pointer';
            toggleButton.style.padding = '0px 1px 0px 1px';
            toggleButton.style.fontWeight = 'bold';
            toggleButton.setAttribute('cmd-level-toggle-button', 'true');
            toggleButton.onclick = () => {
                if (toggleState === 'off') {
                    toggleButton.style.color = '#804e06';
                } else {
                    toggleButton.style.color = 'rgba(255, 0, 0, 1.0)';
                }
                toggleTextBoxes();
                removePotentialLevels();
            };
            document.body.appendChild(toggleButton);
        }
    }

    function removeToggleButton() {
        const toggleButton = document.querySelector('div[cmd-level-toggle-button="true"]');
        if (toggleButton) {
            toggleButton.remove();
        }
    }

    // TODO: This MutationObserver is called on any change in the page, may need to narrow down the observe target
    // Otherwise there may be performance impact on the browser.
    const urlObserver = new MutationObserver((mutations, observer) => {
        if (window.location.href === 'https://elgea.illyriad.co.uk/#/Military/Commanders') {
            drawToggleButton();
            addPotentialLevels();
        } else {
            removeToggleButton();
        }
    });

    urlObserver.observe(document.body, { 
        childList: true,
        subtree: true
    });
})();
