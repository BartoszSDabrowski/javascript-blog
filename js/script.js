{
  const opts = {
    articleSelector: '.post',
    titleSelector: '.post-title',
    titleListSelector: '.titles',
    articleTagsSelector: '.post-tags .list',
    articleAuthorSelector: '.post .post-author',
    tagsListSelector: '.tags.list',
    cloudClassCount: 5,
    cloudClassPrefix: 'tag-size-',
    authorsListSelector: '.authors.list'
  }

  'use strict';
  const titleClickHandler = function(event){
    event.preventDefault();
    const clickedElement = this;
    /* [DONE] remove class 'active' from all article links */
    const activeLinks = document.querySelectorAll('.titles a.active');
    for(let activeLink of activeLinks){
      activeLink.classList.remove('active');
    }
    /* [DONE] add class 'active' to the clicked link */
    clickedElement.classList.add('active');
    /* [DONE] remove class 'active' from all articles */
    const activeArticles = document.querySelectorAll('.post.active');
    for(let activeArticle of activeArticles){
      activeArticle.classList.remove('active');
    }
    /* [DONE] get 'href' attribute from the clicked link */
    const articleSelector = clickedElement.getAttribute('href');
    /* [DONE] find the correct article using the selector (value of 'href' attribute) */
    const targetArticle = document.querySelector(articleSelector);
    /* [DONE] add class 'active' to the correct article */
    targetArticle.classList.add('active');
  };

  function generateTitleLinks(customSelector = ''){
    /* [DONE] remove contents of titleList */
    const titleList = document.querySelector(opts.titleListSelector);
    titleList.innerHTML = '';
    /* [DONE] find all the articles and save them to variable: articles */
    let articles = document.querySelectorAll(opts.articleSelector + customSelector);
    let html = '';
    /* [DONE] for each article */
    for(let article of articles){
      /* [DONE] get the article id */
      const articleId = article.getAttribute('id');
      /* [DONE] find the title element and get the title from the title element */
      const articleTitle = article.querySelector(opts.titleSelector).innerHTML;
      /* [DONE] create HTML of the link */
      const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
      /* [DONE] insert link into titleList */
      html = html + linkHTML;
    }

    titleList.innerHTML = html;

    const links = document.querySelectorAll('.titles a');

    for(let link of links){
      link.addEventListener('click', titleClickHandler);
    }
  }

  generateTitleLinks();

  function calculateTagsParams(tags){
    const params = {
      max: 0,
      min: 999999
    }

    for(let tag in tags){
      if(tags[tag] > params.max){
        params.max = tags[tag];
      }

      if(tags[tag] < params.min){
        params.min = tags[tag];
      }
    }

    return params;
  }

  calculateTagsParams();

  function calculateTagClass(count, params){
    const normalizedCount = count - params.min;

    const normalizedMax = params.max - params.min;

    const percentage = normalizedCount / normalizedMax;

    const classNumber = Math.floor(percentage * (opts.cloudClassCount - 1) + 1);

    return classNumber;
  }

  function generateTags(){
    /* [NEW] create a new variable allTags with an empty object */
    let allTags = {};

    /* [DONE] find all articles */
    const articles = document.querySelectorAll(opts.articleSelector);

    /* [DONE] START LOOP: for every article: */
    for(let article of articles){

        /* [DONE] find tags wrapper */
        const tagsWrapper = article.querySelector(opts.articleTagsSelector);
        /* [DONE] make html variable with empty string */
        let html = '';
        /* [DONE] get tags from data-tags attribute */
        const articleTags = article.getAttribute('data-tags');
        /* [DONE] split tags into array */
        const articleTagsArray = articleTags.split(' ');
        /* [DONE] START LOOP: for each tag */
        for(let tag of articleTagsArray){

            /* [DONE] generate HTML of the link */
            const tagHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';

            /* [DONE] add generated code to html variable */
            html = html + tagHTML + ' ';

            /* [NEW] check if this link is NOT already in allTags */
            if(!allTags[tag]){
              /* [NEW] add tag to allTags object */
              allTags[tag] = 1;
            } else {
              allTags[tag]++;
            }

        /* [DONE] END LOOP: for each tag */
        }

        /* [DONE] insert HTML of all the links into the tags wrapper */
        tagsWrapper.innerHTML = html;

    /* [DONE] END LOOP: for every article: */
    }

    /* [NEW] find list of tags in right column */
    const tagList = document.querySelector(opts.tagsListSelector);

    /* [NEW] create variable for all links HTML code */
    const tagsParams = calculateTagsParams(allTags);
    console.log('tagsParams:', tagsParams)

    let allTagsHTML = '';

    /* [NEW] START LOOP: for each tag in allTags: */
    for(let tag in allTags){
      /* [NEW] generate code of a link and add it to allTagsHTML */
      allTagsHTML += '<li><a href="#tag-' + tag + '" class="' + opts.cloudClassPrefix + calculateTagClass(allTags[tag], tagsParams) + '">' + tag + /*' (' + allTags[tag] + ') ' +*/ '</a></li>';
    }
    /* [NEW] END LOOP: for each tag in allTags: */

    /*[NEW] add HTML from allTagsHTML to tagList */
    tagList.innerHTML = allTagsHTML;
  }

  generateTags();

  function tagClickHandler(event){
    /* [DONE] prevent default action for this event */
    event.preventDefault();
    /* [DONE] make a new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;
    /* [DONE] make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');
    /* [DONE] make a new constant "tag" and extract tag from the "href" constant */
    const tag = href.replace('#tag-', '');
    /* [DONE] find all tag links with class active */
    const activeTags = document.querySelectorAll('a.active[href^="#tag-"]');
    /* [DONE] START LOOP: for each active tag link */
    for(let activeTag of activeTags){
        /* [DONE] remove class active */
        activeTag.classList.remove('active');
    /* [DONE] END LOOP: for each active tag link */
    }
    /* [DONE] find all tag links with "href" attribute equal to the "href" constant */
    const allTags = document.querySelectorAll('a[href="' + href + '"]');
    /* [DONE] START LOOP: for each found tag link */
    for(let singleTag of allTags){
        /* [DONE] add class active */
        singleTag.classList.add('active');
    /* [DONE] END LOOP: for each found tag link */
    }
    /* [DONE] execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-tags~="' + tag + '"]');
  }

  function addClickListenersToTags(){
    /* [DONE] find all links to tags */
    const tagLinks = document.querySelectorAll('.post-tags .list a');
    /* [DONE] START LOOP: for each link */
    for(let tagLink of tagLinks){
        /* [DONE] add tagClickHandler as event listener for that link */
        tagLink.addEventListener('click', tagClickHandler);
    /* [DONE] END LOOP: for each link */
    }
  }

  addClickListenersToTags();

  function generateAuthors(){
    let allAuthors = {};
    /* [DONE] find all articles */
    const articles = document.querySelectorAll(opts.articleSelector);
    /* [DONE] START LOOP: for every article: */
    for(let article of articles){
      /* [DONE] find author wrapper */
      const authorWrapper = article.querySelector(opts.articleAuthorSelector);
      /* [DONE] make html variable with empty string */
      let html = '';
      /* [DONE] get author from data-authors attribute */
      const author = article.getAttribute('data-authors');
      /* [DONE] generate HTML of the author link */
      const authorHTML = '<p class="post-author">by <a href="#author-' + author + '">' + author + '</a></p>';
      /* [DONE] add generated code to html variable */
      html = html + authorHTML;
      /* [DONE] insert author to a wrapper */
      authorWrapper.innerHTML = html;

      /* [DONE] [NEW] check if this link is NOT already in allAuthors */
      if(!allAuthors[author]){
        /* [DONE] [NEW] add author to allAuthors object */
        allAuthors[author] = 1;
      } else {
        allAuthors[author]++;
      }
    /* [DONE] END LOOP: for every article */
    }
    /* [DONE] [NEW] find list of authors in right column */
    const authorsList = document.querySelector(opts.authorsListSelector);
    /* [NEW] create variable for all links HTML code */
    let allAuthorsHTML = '';
    /* [NEW] START LOOP: for each author in allAuthors: */
    for(let author in allAuthors){
      /* [NEW] generate code of a link and add it to allAuthorsHTML */
      allAuthorsHTML += '<li><a href="#author-' + author + '">' + author + ' (' + allAuthors[author] + ') ' + '</a></li>';
    /* [NEW] END LOOP: for each tag in allAuthors: */
    }
    /*[NEW] add HTML from allAuthorsHTML to tagList */
    authorsList.innerHTML = allAuthorsHTML;
    }

  generateAuthors();

  function authorClickHandler(event){
    /* [DONE] prevent default action for this event */
    event.preventDefault();
    /* [DONE] make a new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;
    /* [DONE] make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');
    /* [DONE] make a new constant "author" and extract tag from the "href" constant */
    const author = href.replace('#author-', '');
    /* [DONE] find all author links with class active */
    const activeAuthors = document.querySelectorAll('a.active[href^="#author-"]');
    /* [DONE] START LOOP: for each active tag link */
    for(let activeAuthor of activeAuthors){
      /* [DONE] remove class active */
      activeAuthor.classList.remove('active');
    /* [DONE] END LOOP: for each active tag link */
    }
    /* [DONE] find all author links with "href" attribute equal to the "href" constant */
    const allAuthors = document.querySelectorAll('a[href="' + href + '"]');
    /* [DONE] START LOOP: for each found author link */
    for(let singleAuthor of allAuthors){
      /* [DONE] add class active */
      singleAuthor.classList.add('active');
    /* [DONE] END LOOP: for each found author link */
    }
    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-authors="' + author + '"]');
  }

  function addClickListenersToAuthors(){
    /* [DONE] find all links to authors */
    const authorLinks = document.querySelectorAll('.post-author a');
    /* [DONE] START LOOP: for each link */
    for(let authorLink of authorLinks){
      /* [DONE] add tagClickHandler as event listener for that link */
      authorLink.addEventListener('click', authorClickHandler);
    /* [DONE] END LOOP: for each link */
    }
  }

  addClickListenersToAuthors();
}
