// ==UserScript==
// @name                X(Twitter) - Add notes to the user
// @name:zh-CN          X(Twitter) - 为用户添加备注(别名/标签)
// @name:zh-TW          X(Twitter) - 為使用者新增備註(別名/標籤)
// @namespace           https://greasyfork.org/zh-CN/users/193133-pana
// @homepage            https://greasyfork.org/zh-CN/users/193133-pana
// @website             https://github.com/chasepal/x-twitter-user-notes-fix
// @supportURL          https://github.com/chasepal/x-twitter-user-notes-fix/issues
// @source              https://greasyfork.org/zh-CN/scripts/404587-x-twitter-add-notes-to-the-user
// @icon                data:image/svg+xml;base64,PHN2ZyByb2xlPSJpbWciIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjI0cHgiIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDI0IDI0IiBhcmlhLWxhYmVsbGVkYnk9Im5ld0ljb25UaXRsZSIgc3Ryb2tlPSJyZ2JhKDI5LDE2MSwyNDIsMS4wMCkiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InNxdWFyZSIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgZmlsbD0ibm9uZSIgY29sb3I9InJnYmEoMjksMTYxLDI0MiwxLjAwKSI+IDx0aXRsZSBpZD0ibmV3SWNvblRpdGxlIj5OZXc8L3RpdGxlPiA8cGF0aCBkPSJNMTkgMTRWMjJIMi45OTk5N1Y0SDEzIi8+IDxwYXRoIGQ9Ik0xNy40NjA4IDQuMDM5MjFDMTguMjQxOCAzLjI1ODE3IDE5LjUwODIgMy4yNTgxNiAyMC4yODkyIDQuMDM5MjFMMjAuOTYwOCA0LjcxMDc5QzIxLjc0MTggNS40OTE4NCAyMS43NDE4IDYuNzU4MTcgMjAuOTYwOCA3LjUzOTIxTDExLjU4NTggMTYuOTE0MkMxMS4yMTA3IDE3LjI4OTMgMTAuNzAyIDE3LjUgMTAuMTcxNiAxNy41TDcuNSAxNy41TDcuNSAxNC44Mjg0QzcuNSAxNC4yOTggNy43MTA3MSAxMy43ODkzIDguMDg1NzkgMTMuNDE0MkwxNy40NjA4IDQuMDM5MjFaIi8+IDxwYXRoIGQ9Ik0xNi4yNSA1LjI1TDE5Ljc1IDguNzUiLz4gPC9zdmc+
// @version             6.2.0.2
// @description         Add notes (aliases/tags) for users to help identify and search, and support WebDAV sync
// @description:zh-CN   为用户添加备注(别名/标签)功能，以帮助识别和搜索，并支持 WebDAV 同步功能
// @description:zh-TW   為使用者新增備註(別名/標籤)功能，以幫助識別和搜尋，並支援 WebDAV 同步功能
// @author              pana (original), chasepal (2026 compatibility fix)
// @license             GNU General Public License v3.0 or later
// @compatible          chrome
// @compatible          firefox
// @match               *://x.com/*
// @match               *://*twitter.com/*
// @require             https://gcore.jsdelivr.net/gh/LightAPIs/greasy-fork-library@47d998f5f1e438fe137647b8735b1e17a77e4b69/Note_Obj.js
// @connect             *
// @noframes
// @grant               GM_info
// @grant               GM_getValue
// @grant               GM_setValue
// @grant               GM_deleteValue
// @grant               GM_listValues
// @grant               GM_openInTab
// @grant               GM_addStyle
// @grant               GM_xmlhttpRequest
// @grant               GM_registerMenuCommand
// @grant               GM_unregisterMenuCommand
// @grant               GM_addValueChangeListener
// @grant               GM_removeValueChangeListener
// @downloadURL         https://raw.githubusercontent.com/chasepal/x-twitter-user-notes-fix/main/x-twitter-user-notes-fixed.user.js
// @updateURL           https://raw.githubusercontent.com/chasepal/x-twitter-user-notes-fix/main/x-twitter-user-notes-fixed.meta.js
// ==/UserScript==

(function () {
  'use strict';
  // Local compatibility update for X's 2026 DOM.  Keep @name/@namespace and
  // Note_Obj's id unchanged so an in-place Tampermonkey update keeps all notes.
  const UPDATED = '2026-08-09';
  const TWITTER_ICON = {
    NOTE_GRAY: 'url(data:image/svg+xml;base64,PHN2ZyByb2xlPSJpbWciIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjI0cHgiIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDI0IDI0IiBhcmlhLWxhYmVsbGVkYnk9Im5ld0ljb25UaXRsZSIgc3Ryb2tlPSJyZ2IoMTAxLCAxMTksIDEzNCkiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InNxdWFyZSIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgZmlsbD0ibm9uZSIgY29sb3I9InJnYigxMDEsIDExOSwgMTM0KSI+IDx0aXRsZSBpZD0ibmV3SWNvblRpdGxlIj5OZXc8L3RpdGxlPiA8cGF0aCBkPSJNMTkgMTRWMjJIMi45OTk5N1Y0SDEzIi8+IDxwYXRoIGQ9Ik0xNy40NjA4IDQuMDM5MjFDMTguMjQxOCAzLjI1ODE3IDE5LjUwODIgMy4yNTgxNiAyMC4yODkyIDQuMDM5MjFMMjAuOTYwOCA0LjcxMDc5QzIxLjc0MTggNS40OTE4NCAyMS43NDE4IDYuNzU4MTcgMjAuOTYwOCA3LjUzOTIxTDExLjU4NTggMTYuOTE0MkMxMS4yMTA3IDE3LjI4OTMgMTAuNzAyIDE3LjUgMTAuMTcxNiAxNy41TDcuNSAxNy41TDcuNSAxNC44Mjg0QzcuNSAxNC4yOTggNy43MTA3MSAxMy43ODkzIDguMDg1NzkgMTMuNDE0MkwxNy40NjA4IDQuMDM5MjFaIi8+IDxwYXRoIGQ9Ik0xNi4yNSA1LjI1TDE5Ljc1IDguNzUiLz4gPC9zdmc+)',
    NOTE_BLUE: 'url(data:image/svg+xml;base64,PHN2ZyByb2xlPSJpbWciIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjI0cHgiIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDI0IDI0IiBhcmlhLWxhYmVsbGVkYnk9Im5ld0ljb25UaXRsZSIgc3Ryb2tlPSJyZ2JhKDI5LDE2MSwyNDIsMS4wMCkiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InNxdWFyZSIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgZmlsbD0ibm9uZSIgY29sb3I9InJnYmEoMjksMTYxLDI0MiwxLjAwKSI+IDx0aXRsZSBpZD0ibmV3SWNvblRpdGxlIj5OZXc8L3RpdGxlPiA8cGF0aCBkPSJNMTkgMTRWMjJIMi45OTk5N1Y0SDEzIi8+IDxwYXRoIGQ9Ik0xNy40NjA4IDQuMDM5MjFDMTguMjQxOCAzLjI1ODE3IDE5LjUwODIgMy4yNTgxNiAyMC4yODkyIDQuMDM5MjFMMjAuOTYwOCA0LjcxMDc5QzIxLjc0MTggNS40OTE4NCAyMS43NDE4IDYuNzU4MTcgMjAuOTYwOCA3LjUzOTIxTDExLjU4NTggMTYuOTE0MkMxMS4yMTA3IDE3LjI4OTMgMTAuNzAyIDE3LjUgMTAuMTcxNiAxNy41TDcuNSAxNy41TDcuNSAxNC44Mjg0QzcuNSAxNC4yOTggNy43MTA3MSAxMy43ODkzIDguMDg1NzkgMTMuNDE0MkwxNy40NjA4IDQuMDM5MjFaIi8+IDxwYXRoIGQ9Ik0xNi4yNSA1LjI1TDE5Ljc1IDguNzUiLz4gPC9zdmc+)'
  };
  const selector = {
    root: '#react-root',
    homepage: {
      article: 'article',
      userName: '[data-testid="User-Name"]',
      toolBar: ':scope [role="group"][id]',
      reprint: '[data-testid="socialContext"]',
      at: '[data-testid="tweetText"] a[href]'
    },
    userpage: {
      main: '[data-testid="UserName"]',
      actions: '[data-testid="userActions"]'
    },
    hover: {
      panel: '[data-testid="HoverCard"]',
      userAvatar: '[data-testid^="UserAvatar-Container-"]'
    },
    modal: {
      cell: '[aria-labelledby="modal-header"] [data-testid="UserCell"]',
      id: 'a[role="link"]',
      showName: 'a[role="link"] > div > [dir] > span'
    },
    follow: {
      cell: '[data-testid="cellInnerDiv"] [data-testid="UserCell"]',
      id: 'a[role="link"]',
      showName: 'a[role="link"] > div > [dir] > span'
    },
    rightRecommended: {
      cell: '[role="complementary"] [data-testid="UserCell"]',
      id: 'a[role="link"]',
      showName: 'a[role="link"] > div > [dir]'
    }
  };
  const nameSet = {
    blueTag: 'note-obj-twitter-blue-tag',
    noteBtn: 'note-obj-twitter-note-btn',
    panelBtn: 'note-obj-twitter-panel-btn',
    beforeFollowNoteBtn: 'note-obj-twitter-before-follow-note-btn',
    baseToolBarBtn: 'note-obj-twitter-base-tool-bar-btn',
    commentToolBarBtn: 'note-obj-twitter-comment-tool-bar-btn'
  };
  const style = `
    .${nameSet.blueTag} {
      background-color: #3c81df;
      color: #fff;
      display: inline-flex;
      align-items: center;
      padding: 2px 10px;
      line-height: 100%;
      border-radius: 50px;
    }
    .${nameSet.noteBtn} {
      background-image: ${TWITTER_ICON.NOTE_GRAY};
      background-repeat: no-repeat;
      background-position: center;
      background-color: rgba(0, 0, 0, 0);
      border-bottom-left-radius: 9999px;
      border-bottom-right-radius: 9999px;
      border-top-left-radius: 9999px;
      border-top-right-radius: 9999px;
      transition-property: background-color, box-shadow;
      transition-duration: 0.2s;
    }
    .${nameSet.noteBtn}:hover {
      background-image: ${TWITTER_ICON.NOTE_BLUE};
      background-color: rgba(29, 161, 242, .1);
    }
    .${nameSet.panelBtn} {
      height: 32px;
      width: 32px;
      margin: 5px 0px 0px 0px;
      background-size: 28px auto;
      cursor: pointer !important;
      border-radius: 0px;
    }
    .${nameSet.panelBtn}:hover::after {
      content: "";
      display: flex;
      position: relative;
      background-color: rgba(29, 161, 242, .1);
      width: 48px;
      height: 48px;
      top: -8px;
      left: -8px;
      border-radius: 99px;
    }
    .${nameSet.beforeFollowNoteBtn} {
      height: 36px;
      width: 36px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      padding: 0;
      background-image: ${TWITTER_ICON.NOTE_BLUE};
      background-repeat: no-repeat;
      background-size: 19px auto;
      background-position: center;
      flex: 0 0 36px;
      margin: 0 8px 12px 0;
      cursor: pointer;
      border: 1px solid rgba(29, 161, 242, 1);
      border-bottom-left-radius: 9999px;
      border-bottom-right-radius: 9999px;
      border-top-left-radius: 9999px;
      border-top-right-radius: 9999px;
      background-color: rgba(0, 0, 0, 0);
      transition-property: background-color, box-shadow;
      transition-duration: 0.2s;
    }
    .${nameSet.beforeFollowNoteBtn}:hover {
      background-color: rgba(29, 161, 242, .1);
    }
    .${nameSet.baseToolBarBtn} {
      height: 18px;
      width: 18px;
      margin: 0px -40px 0px 0px;
      background-size: 20px auto;
      border-radius: 0px;
      margin: 0 12px;
    }
    .${nameSet.baseToolBarBtn}:hover::after {
      content: "";
      position: absolute;
      background-color: rgba(29, 161, 242, .1);
      width: 34px;
      height: 34px;
      top: -8px;
      right: 5px;
      border-radius: 99px;
    }
    .${nameSet.commentToolBarBtn} {
      height: 24px;
      width: 24px;
      margin: 10px 0px 0px 0px;
      background-size: 24px auto;
      border-radius: 0px;
      cursor: pointer;
      margin-left: 12px;
    }
    .${nameSet.commentToolBarBtn}:hover::after {
      content: "";
      position: absolute;
      background-color: rgba(29, 161, 242, .1);
      width: 38px;
      height: 38px;
      top: 3px;
      right: -2px;
      border-radius: 99px;
    }
    ${selector.homepage.userName}, ${selector.modal.showName} {
      white-space: normal;
    }
    .note-obj-add-frame-dialog button {
      text-align: center;
    }
    .note-obj-management-frame-save-content,
    .note-obj-management-frame-cancel-content,
    .note-obj-group-frame-save-content,
    .note-obj-group-frame-cancel-content {
      font-size: 12px;
    }`;
  const noteObj = new Note_Obj({
    id: 'myTwitterNote',
    script: {
      author: {
        name: 'pana',
        homepage: 'https://greasyfork.org/zh-CN/users/193133-pana'
      },
      url: 'https://greasyfork.org/scripts/404587',
      updated: UPDATED
    },
    style,
    changeEvent: changeEvent,
    settings: {
      showToolbarButton: {
        type: 'checkbox',
        lang: {
          en: 'Display the "Note" button in the toolbar below each tweet (if there is no such button in the user\'s hover information panel, this option can be turned on)',
          zhHans: '在每条推特下方的工具栏里显示"备注"按钮 (如果在用户的悬停信息面板里没有此按钮时，可以打开此选项)',
          zhHant: '在每條推特下方的工具欄裡顯示"備註"按鈕 (如果在使用者的懸停資訊面板裡沒有此按鈕時，可以開啟此選項)'
        },
        default: false,
        event: insertToolbarButtonEvent
      },
      disableInTweets: {
        type: 'checkbox',
        lang: {
          en: 'Disable replacing @user with @note in tweets',
          zhHans: '禁用将推文中的 @user 替换为 @note',
          zhHant: '禁用將推文中的 @user 替換為 @note'
        },
        default: false,
        event: disableInTweetsEvent
      }
    }
  });
  const articleState = new WeakMap();
  const profileState = new WeakMap();
  const cellState = new WeakMap();
  const hoverState = new WeakMap();
  const PROFILE_PATH_RE = /^\/([A-Za-z0-9_]{1,15})\/?$/;
  let scanTimer = 0;

  function atFilter(text) {
    return text.replace(/^@/, '');
  }

  function getProfileIdFromHref(href) {
    if (!href) return '';
    try {
      const path = new URL(href, location.origin).pathname;
      const match = path.match(PROFILE_PATH_RE);
      return match ? decodeURIComponent(match[1]) : '';
    } catch (_) {
      return '';
    }
  }

  function hrefComparator(href) {
    return getProfileIdFromHref(href) !== '';
  }

  function sameId(left, right) {
    return String(left || '').replace(/^@/, '').toLowerCase() === String(right || '').replace(/^@/, '').toLowerCase();
  }

  function cleanText(node) {
    if (!node) return '';
    if (node.nodeType === Node.TEXT_NODE) return node.nodeValue || '';
    if (node.nodeType !== Node.ELEMENT_NODE) return '';
    if (node.matches('.' + Note_Obj.tagClassName + ', font.immersive-translate-target-wrapper')) return '';
    return Array.from(node.childNodes, cleanText).join('').trim();
  }

  function findLinkedIdentity(container, boxSelector) {
    const box = boxSelector
      ? (container.matches && container.matches(boxSelector) ? container : container.querySelector(boxSelector))
      : container;
    if (!box) return null;
    const candidates = Array.from(box.querySelectorAll('a[href]'))
      .map(link => ({ link, id: getProfileIdFromHref(link.getAttribute('href')), text: cleanText(link) }))
      .filter(item => item.id);
    const handle = candidates.find(item => item.text.replace(/\s/g, '').toLowerCase() === '@' + item.id.toLowerCase());
    const profile = handle || candidates[0];
    if (!profile) {
      // Quoted posts are one large role=link in the current X DOM, so their
      // User-Name block has no nested anchors.  Fall back to the visible @id.
      const dirNodes = Array.from(box.querySelectorAll('[dir]'));
      const handleNode = dirNodes.find(node => /^@[A-Za-z0-9_]{1,15}$/.test(cleanText(node).replace(/\s/g, '')));
      const id = handleNode ? atFilter(cleanText(handleNode).replace(/\s/g, '')) : '';
      const target = dirNodes.find(node => {
        const text = cleanText(node);
        return text && !text.trim().startsWith('@');
      });
      return id && target ? { id, name: cleanText(target), target, box } : null;
    }
    const name = candidates.find(item => sameId(item.id, profile.id) && item.text && !item.text.trim().startsWith('@'));
    if (!name) return null;
    const target = name.link.querySelector('[dir]') || name.link;
    return { id: profile.id, name: cleanText(target) || name.text, target, box };
  }

  function findProfileIdentity(box) {
    if (!box) return null;
    const dirNodes = Array.from(box.querySelectorAll('[dir]'));
    const handleNode = dirNodes.find(node => /^@[A-Za-z0-9_]{1,15}$/.test(cleanText(node).replace(/\s/g, '')));
    const id = handleNode ? atFilter(cleanText(handleNode).replace(/\s/g, '')) : '';
    const target = dirNodes.find(node => {
      const text = cleanText(node);
      return text && !text.trim().startsWith('@');
    });
    return id && target ? { id, name: cleanText(target), target, box } : null;
  }

  function applyIdentityNote(identity, changeId, extra = {}) {
    if (!identity || (changeId && !sameId(changeId, identity.id))) return;
    noteObj.handler(identity.id, identity.target, undefined, Object.assign({
      add: 'span',
      className: [nameSet.blueTag]
    }, extra), identity.name);
  }

  function toolBarNoteButton(ele, state) {
    const identity = findLinkedIdentity(ele, selector.homepage.userName);
    const toolBar = ele.querySelector(selector.homepage.toolBar);
    if (!identity || !toolBar) return;
    const oldButton = toolBar.querySelector('.' + nameSet.noteBtn);
    if (!state) {
      oldButton && oldButton.remove();
      return;
    }
    if (!oldButton) {
      toolBar.appendChild(noteObj.createNoteBtn(identity.id, identity.name, [nameSet.noteBtn, nameSet.baseToolBarBtn]));
    }
  }

  function homepageNote(ele, changeId) {
    applyIdentityNote(findLinkedIdentity(ele, selector.homepage.userName), changeId);
  }

  function reprintANote(ele, changeId) {
    const context = ele.querySelector(selector.homepage.reprint);
    applyIdentityNote(context && findLinkedIdentity(context), changeId, { offsetWidth: 30 });
  }

  function blockquoteNote(ele, changeId) {
    const userBoxes = Array.from(ele.querySelectorAll(selector.homepage.userName));
    userBoxes.slice(1).forEach(box => applyIdentityNote(findLinkedIdentity(box), changeId));
  }

  function homepageAtNote(ele, state, changeId) {
    for (const atUser of ele.querySelectorAll(selector.homepage.at)) {
      const href = atUser.getAttribute('href') || '';
      if (!hrefComparator(href)) continue;
      const atUserId = getProfileIdFromHref(href);
      if (!changeId || sameId(changeId, atUserId)) {
        noteObj.handler(atUserId, atUser, undefined, { prefix: '@', restore: state });
      }
    }
  }

  function ensureProfileButton(box, identity) {
    if (!identity) return;
    const main = box.closest('main') || document;
    const actions = main.querySelector(selector.userpage.actions);
    const row = actions && actions.parentElement;
    if (!row) return;
    let button = row.querySelector('.' + nameSet.beforeFollowNoteBtn);
    if (button && !sameId(button.dataset.noteObjUserId, identity.id)) {
      button.remove();
      button = null;
    }
    if (!button) {
      button = noteObj.createNoteBtn(identity.id, identity.name, [nameSet.beforeFollowNoteBtn], 'button');
      button.type = 'button';
      button.dataset.noteObjUserId = identity.id;
      row.insertAdjacentElement('afterbegin', button);
    }
  }

  function userpageNote(ele, changeId) {
    const identity = findProfileIdentity(ele);
    applyIdentityNote(identity, changeId);
    ensureProfileButton(ele, identity);
  }

  function spanItemNote(ele, changeId) {
    applyIdentityNote(findLinkedIdentity(ele), changeId);
  }

  function followNote(ele, changeId) {
    spanItemNote(ele, changeId);
  }

  function rightRecommendedNote(ele, changeId) {
    spanItemNote(ele, changeId);
  }

  function modalNote(ele, changeId) {
    spanItemNote(ele, changeId);
  }

  function identityIdsWithin(ele) {
    return Array.from(ele.querySelectorAll(selector.homepage.userName))
      .map(box => findLinkedIdentity(box)?.id || '')
      .filter(Boolean);
  }

  function articleSignature(ele) {
    const statusHref = ele.querySelector('a[href*="/status/"]')?.getAttribute('href') || '';
    const ids = identityIdsWithin(ele);
    const mentions = Array.from(ele.querySelectorAll(selector.homepage.at))
      .map(link => getProfileIdFromHref(link.getAttribute('href')))
      .filter(Boolean);
    return JSON.stringify([
      statusHref,
      ids,
      mentions,
      !!ele.querySelector(selector.homepage.toolBar),
      !!ele.querySelector('.' + nameSet.noteBtn),
      ele.querySelectorAll('.' + nameSet.blueTag).length,
      noteObj.getOtherConfig().showToolbarButton === true,
      noteObj.getOtherConfig().disableInTweets === true
    ]);
  }

  function processArticle(ele, force = false, changeId) {
    const before = articleSignature(ele);
    if (!force && articleState.get(ele) === before) return;
    toolBarNoteButton(ele, noteObj.getOtherConfig().showToolbarButton === true);
    homepageNote(ele, changeId);
    reprintANote(ele, changeId);
    blockquoteNote(ele, changeId);
    homepageAtNote(ele, noteObj.getOtherConfig().disableInTweets === true, changeId);
    articleState.set(ele, articleSignature(ele));
  }

  function processProfile(ele, force = false, changeId) {
    const identity = findProfileIdentity(ele);
    const before = JSON.stringify([
      identity?.id || '',
      !!document.querySelector('.' + nameSet.beforeFollowNoteBtn),
      ele.querySelectorAll('.' + nameSet.blueTag).length
    ]);
    if (!force && profileState.get(ele) === before) return;
    userpageNote(ele, changeId);
    const afterIdentity = findProfileIdentity(ele);
    profileState.set(ele, JSON.stringify([
      afterIdentity?.id || '',
      !!document.querySelector('.' + nameSet.beforeFollowNoteBtn),
      ele.querySelectorAll('.' + nameSet.blueTag).length
    ]));
  }

  function processCell(ele, force = false, changeId) {
    const identity = findLinkedIdentity(ele);
    const before = JSON.stringify([identity?.id || '', ele.querySelectorAll('.' + nameSet.blueTag).length]);
    if (!force && cellState.get(ele) === before) return;
    spanItemNote(ele, changeId);
    cellState.set(ele, JSON.stringify([identity?.id || '', ele.querySelectorAll('.' + nameSet.blueTag).length]));
  }

  function processHover(ele, force = false, changeId) {
    const identity = findLinkedIdentity(ele);
    const before = JSON.stringify([
      identity?.id || '',
      !!ele.querySelector('.' + nameSet.panelBtn),
      ele.querySelectorAll('.' + nameSet.blueTag).length
    ]);
    if (!force && hoverState.get(ele) === before) return;
    if (identity) {
      const avatar = ele.querySelector(selector.hover.userAvatar);
      if (avatar && !ele.querySelector('.' + nameSet.panelBtn)) {
        avatar.after(noteObj.createNoteBtn(identity.id, identity.name, [nameSet.noteBtn, nameSet.panelBtn]));
      }
      applyIdentityNote(identity, changeId);
    }
    hoverState.set(ele, JSON.stringify([
      identity?.id || '',
      !!ele.querySelector('.' + nameSet.panelBtn),
      ele.querySelectorAll('.' + nameSet.blueTag).length
    ]));
  }

  function scanAll(force = false, changeId) {
    document.querySelectorAll(selector.homepage.article).forEach(ele => processArticle(ele, force, changeId));
    document.querySelectorAll(selector.userpage.main).forEach(ele => processProfile(ele, force, changeId));
    document.querySelectorAll('[data-testid="UserCell"]').forEach(ele => processCell(ele, force, changeId));
    document.querySelectorAll(selector.hover.panel).forEach(ele => processHover(ele, force, changeId));
  }

  function scheduleScan() {
    if (scanTimer) return;
    scanTimer = window.setTimeout(() => {
      scanTimer = 0;
      scanAll();
    }, 60);
  }

  function disableInTweetsEvent(status) {
    document.querySelectorAll(selector.homepage.article).forEach(ele => homepageAtNote(ele, status));
  }

  function insertToolbarButtonEvent(status) {
    document.querySelectorAll(selector.homepage.article).forEach(ele => toolBarNoteButton(ele, status));
  }

  function changeEvent(changeId) {
    scanAll(true, changeId);
  }

  function init() {
    const rootDom = document.querySelector(selector.root);
    if (!rootDom) return;
    scanAll();
    new MutationObserver(scheduleScan).observe(rootDom, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['href', 'data-testid']
    });
  }
  init();
})();
