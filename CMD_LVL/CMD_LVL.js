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

    // function calculateXpForLevel(level) {
    //     if (level === 0) {
    //         return 0;
    //     }
    //     return 10 + ((level - 1) * 20) + calculateXpForLevel(level - 1);
    // }

    function calculateMaxPossibleLevel(xp) {
        var level = 1;
        var xpNeeded = 10;
        while (xpNeeded <= xp) {
            xpNeeded += 20 * level;
            level += 1;
        }
        return level - 1;
    }

    // Appends the potential levels (in parentheses) to the end of the cell with the current level
    function addPotentialLevels() {
        if (toggleState === 'off') return;
        const commanderTable = document.querySelector("#MainContentDiv > div.info > div.accordionCommand.ui-accordion.ui-widget.ui-helper-reset.ui-accordion-icons")
        var xpCells = document.evaluate(".//h3/a/table/tbody/tr/td[5]", commanderTable, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        var levelCells = document.evaluate(".//h3/a/table/tbody/tr/td[6]", commanderTable, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

        console.assert(xpCells.snapshotLength === levelCells.snapshotLength, "XP and Level snapshot lengths are unequal.");

        for (var i = 0; i < xpCells.snapshotLength; i++) {
            var levelNode = levelCells.snapshotItem(i);
            if (levelNode.textContent.lastIndexOf(')') != -1) {
                continue;
            }
            var xpNode = xpCells.snapshotItem(i);
            var currXp = xpNode.textContent.substring(0, xpNode.textContent.indexOf('/'));

            var possibleLevel = calculateMaxPossibleLevel(Number(currXp));
            var currLevel = Number(levelNode.textContent)
            if (possibleLevel === currLevel) {
                continue;
            }

            // TODO: Edit the width of the cell to 42px so that the new level does not show on a newline.
            levelNode.textContent = levelNode.textContent + ' (' + possibleLevel + ')';
        }
    }

    // On toggle off, this function removes the potential level (in parentheses)
    function removePotentialLevels() {
        if (toggleState === 'on') return;
        const commanderTable = document.querySelector("#MainContentDiv > div.info > div.accordionCommand.ui-accordion.ui-widget.ui-helper-reset.ui-accordion-icons")
        var levelCells = document.evaluate(".//h3/a/table/tbody/tr/td[6]", commanderTable, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

        for (var i = 0; i < levelCells.snapshotLength; i++) {
            var levelNode = levelCells.snapshotItem(i);
            var parenPos = levelNode.textContent.indexOf('(');
            if (parenPos != -1) {
                levelNode.textContent = levelNode.textContent.substring(0, parenPos - 1);
            }
        }
    }

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
