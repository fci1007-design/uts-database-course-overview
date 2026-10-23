(() => {
  'use strict';
  const {slides,groups}=window.COURSE_DATA;
  const $=s=>document.querySelector(s);
  const $$=s=>[...document.querySelectorAll(s)];
  const escape=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const key='uts-database-overview-v1';
  let saved={}; try {saved=JSON.parse(localStorage.getItem(key)||'{}');}catch{}
  let index=0,readAll=!!saved.readAll,drawer=false,focused=false,toastTimer;
  let textSize=saved.textSize==='extra'?'extra':'large';
  document.documentElement.dataset.textSize=textSize;
  $('#textSize').value=textSize;
  const storedOpen=new Set(saved.open||['start','unit1']);
  const icons={
    overview:'<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',
    query:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
    design:'<rect x="2" y="3" width="8" height="6" rx="1.5"/><rect x="14" y="15" width="8" height="6" rx="1.5"/><path d="M6 9v9h8"/>',
    integrity:'<path d="M12 2 21 6v6c0 5-9 10-9 10S3 17 3 12V6Z"/><path d="m8 12 3 3 5-6"/>',
    cases:'<path d="m12 2 10 6-10 6L2 8Z"/><path d="m2 12 10 6 10-6M2 16l10 6 10-6"/>',
    assessments:'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h3"/>'
  };
  const svg=name=>'<svg viewBox="0 0 24 24" aria-hidden="true">'+(icons[name]||icons.overview)+'</svg>';
  const tint={unit2:['#147d78','#e4f0ed'],unit3:['#ad6530','#f6ebde'],unit4:['#8657b9','#efe7f7'],review:['#68718e','#e8eaf1']};
  const persist=()=>{try{localStorage.setItem(key,JSON.stringify({index,readAll,textSize,open:$$('.nav-group[open]').map(d=>d.dataset.group)}));}catch{}};
  function toast(message){$('#toast').textContent=message;$('#toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),2600);}
  $('#outline').innerHTML=groups.map(g=>{
    const [color,bg]=tint[g.id]||['#4658d9','#e7eafb'];
    return `<details class="nav-group" data-group="${g.id}" ${storedOpen.has(g.id)?'open':''}><summary><span class="nav-icon" style="--nav-color:${color};--nav-tint:${bg}">${svg(g.icon)}</span><span class="nav-title">${escape(g.title)}<small>${escape(g.week)}</small></span><svg class="chevron" viewBox="0 0 12 12" aria-hidden="true"><path d="m4 2 4 4-4 4"/></svg></summary><div class="nav-children">${slides.map((s,i)=>s.group===g.id?`<a class="nav-link" href="#${s.id}" data-index="${i}">${escape(s.navTitle)}</a>`:'').join('')}</div></details>`;
  }).join('');
  function hero(){return `<div class="slide-hero"><div><div class="hero-tag">321606 Database</div><h1 class="hero-title">從零認識<br>資料庫。</h1><p class="hero-subtitle">先掌握觀念，再看懂這門課的全貌。</p></div><div class="hero-visual" role="img" aria-label="示意：商品透過製造商編號，連到製造商資料表"><div class="data-cluster"><svg class="relation-line" viewBox="0 0 300 210" aria-hidden="true"><path d="M153 68h58v58h-36"/><circle cx="153" cy="68" r="4" fill="#a8b0e5"/><circle cx="175" cy="126" r="4" fill="#a8b0e5"/></svg><div class="data-table"><div class="table-name">製造商 ${svg('cases')}</div><div class="demo-row"><b>01</b><span>廠商名稱</span></div><div class="demo-row"><b>02</b><span>聯絡資訊</span></div></div><div class="data-table"><div class="table-name">商品 ${svg('overview')}</div><div class="demo-row"><b>101</b><span>商品名稱</span></div><div class="demo-row"><b>01</b><span>製造商編號</span></div></div><div class="relation-label"><span>1</span>關聯<span>多</span></div></div></div></div>`;}
  function concept(s){
    if(s.group==='unit2'&&s.title.startsWith('2.1'))return '<div class="concept-strip" aria-label="學生和課程的多對多透過選課表連接"><div class="concept-node"><strong>學生</strong><small>用學號識別</small></div><span class="concept-arrow" aria-hidden="true">↔</span><div class="concept-node concept-bridge"><strong>選課表</strong><small>兩邊的識別編號</small></div><span class="concept-arrow" aria-hidden="true">↔</span><div class="concept-node"><strong>課程</strong><small>用課程編號識別</small></div></div>';
    return '';
  }
  $('#slides').innerHTML=slides.map((s,i)=>{
    let title=s.title;
    const chapter=title.match(/^(\d[^：]*)(?:：)(.*)$/);
    if(chapter) title=`<span class="chapter-number">${escape(chapter[1])}</span>${escape(chapter[2])}`;else title=escape(title);
    return `<section class="slide ${i===0?'overview':''}" id="${s.id}" data-index="${i}" data-group="${s.group}" aria-label="${escape(s.title)}" ${i?'hidden':''}><div class="slide-header"><span class="section-pill">${escape(s.groupTitle)}</span><span class="week">${escape(s.week)}</span></div>${i===0?hero():`<h1>${title}</h1>`}${concept(s)}<div class="prose">${s.html}</div></section>`;
  }).join('');
  $$('.prose a[href^="materials/"]').forEach(a=>{a.href=(window.RESOURCE_BASE||'')+a.getAttribute('href');});
  $$('.prose a[href^="https://"]').forEach(a=>{a.target='_blank';a.rel='noopener noreferrer';});
  $$('.prose table').forEach(table=>{
    table.classList.add('mobile-stacked');
    const labels=[...table.querySelectorAll('th')].map(t=>t.textContent);
    table.querySelectorAll('tbody tr').forEach(row=>[...row.children].forEach((cell,i)=>{cell.dataset.label=labels[i]||'';}));
  });
  $$('.prose blockquote').forEach(quote=>{if(quote.textContent.trim().startsWith('商業例子'))quote.classList.add('business-example');});
  $$('.prose pre code').forEach(code=>{
    code.innerHTML=escape(code.textContent).replace(/\b(SELECT|FROM|WHERE|ORDER BY|DESC|AS|JOIN|ON|GROUP BY|HAVING|COUNT)\b/g,'<span class="sql-keyword">$1</span>').replace(/\b(10000|2)\b/g,'<span class="sql-number">$1</span>');
  });
  $$('.prose>p:last-child').forEach(p=>{if(p.textContent.startsWith('這個單元學到的能力'))p.classList.add('takeaway');});
  $('#dots').innerHTML=slides.map(()=>'<i></i>').join('');
  function mobile(){return matchMedia('(max-width:960px)').matches;}
  function updateInert(){
    $('#sidebar').inert=(mobile()&&!drawer)||(!mobile()&&focused);
    $('#workspace').inert=drawer;
  }
  function setDrawer(open,restore=true){
    drawer=open;document.body.classList.toggle('drawer-open',open);$('#scrim').hidden=!open;
    $('#openMenu').setAttribute('aria-expanded',String(open));
    updateInert();
    if(open)$('#search').focus();else if(restore)$('#openMenu').focus();
  }
  function updateControls(){
    const s=slides[index];
    $('#breadcrumb').textContent=s.groupTitle;
    const position=String(index+1).padStart(2,'0')+' / '+slides.length;
    $('#pageNumber').textContent=position;$('#sidebarPosition').textContent=position;
    $('#sidebarProgress').style.width=((index+1)/slides.length*100)+'%';
    $$('.nav-link').forEach(a=>{if(Number(a.dataset.index)===index)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
    $$('#dots i').forEach((dot,i)=>dot.classList.toggle('active',i===index));
    $('#previous').disabled=index===0;$('#next').disabled=index===slides.length-1;
    $('#nextTopic').textContent=index<slides.length-1?'下一節：'+slides[index+1].navTitle:'已看完全部主題';
    document.title=s.navTitle+'｜Database 課程概覽';
  }
  function navigate(to,{writeHash=true,scroll=true,focus=false,expand=true}={}){
    index=Math.max(0,Math.min(slides.length-1,to));
    $$('.slide').forEach((s,i)=>s.hidden=!readAll&&i!==index);
    if(expand){const group=$(`.nav-group[data-group="${slides[index].group}"]`);if(group)group.open=true;}
    if(writeHash&&location.hash!=='#'+slides[index].id)history.pushState(null,'','#'+slides[index].id);
    updateControls();persist();
    if(scroll){if(readAll)$('#'+slides[index].id).scrollIntoView({block:'start',behavior:'instant'});else window.scrollTo({top:0,behavior:'instant'});}
    if(focus)$('#main').focus({preventScroll:true});
  }
  function syncMode(){
    document.body.classList.toggle('read-all',readAll);
    $('#slidesMode').setAttribute('aria-pressed',String(!readAll));$('#readMode').setAttribute('aria-pressed',String(readAll));
    navigate(index,{writeHash:false});
  }
  $('#outline').addEventListener('click',e=>{
    const link=e.target.closest('.nav-link');if(!link)return;
    e.preventDefault();if(drawer)setDrawer(false,false);navigate(Number(link.dataset.index),{focus:true});
  });
  $$('.nav-group').forEach(d=>d.addEventListener('toggle',()=>{
    $('#collapseAll').textContent=$$('.nav-group[open]').length?'全部收合':'全部展開';persist();
  }));
  $('#collapseAll').addEventListener('click',()=>{const expand=!$$('.nav-group[open]').length;$$('.nav-group:not([hidden])').forEach(d=>d.open=expand);});
  $('#search').addEventListener('input',()=>{
    const q=$('#search').value.trim().toLocaleLowerCase();let total=0;
    $$('.nav-group').forEach(d=>{let matches=0;d.querySelectorAll('.nav-link').forEach(a=>{
      const s=slides[Number(a.dataset.index)];const show=!q||(s.title+' '+s.text+' '+s.groupTitle).toLocaleLowerCase().includes(q);
      a.hidden=!show;if(show)matches++;
    });d.hidden=!matches;if(q&&matches)d.open=true;total+=matches;});
    $('#noResults').hidden=total>0;
  });
  $('#openMenu').addEventListener('click',()=>setDrawer(true));$('#closeMenu').addEventListener('click',()=>setDrawer(false));$('#scrim').addEventListener('click',()=>setDrawer(false));
  $('#previous').addEventListener('click',()=>navigate(index-1,{focus:true}));$('#next').addEventListener('click',()=>navigate(index+1,{focus:true}));
  $('#readMode').addEventListener('click',()=>{readAll=true;syncMode();});$('#slidesMode').addEventListener('click',()=>{readAll=false;syncMode();});
  $('#textSize').addEventListener('change',()=>{textSize=$('#textSize').value;document.documentElement.dataset.textSize=textSize;persist();});
  $('#focusButton').addEventListener('click',()=>{focused=!focused;document.body.classList.toggle('focus-mode',focused);$('#focusButton').setAttribute('aria-pressed',String(focused));$('#focusButton').setAttribute('aria-label',focused?'關閉專注模式':'開啟專注模式');updateInert();});
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'&&drawer){setDrawer(false);return;}
    if(drawer&&e.key==='Tab'){
      const focusables=$$('#sidebar a[href],#sidebar button,#sidebar input,#sidebar summary').filter(el=>el.getClientRects().length&&!el.closest('[hidden]'));
      const first=focusables[0],last=focusables.at(-1);
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}return;
    }
    if(e.ctrlKey||e.metaKey||e.altKey||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)||e.target.isContentEditable)return;
    if(e.key==='/'&&!drawer){e.preventDefault();if(mobile())setDrawer(true);else if(!focused)$('#search').focus();return;}
    if(drawer)return;
    if(e.key==='ArrowRight'){e.preventDefault();navigate(index+1,{focus:true});}
    if(e.key==='ArrowLeft'){e.preventDefault();navigate(index-1,{focus:true});}
  });
  function hashIndex(){return slides.findIndex(s=>'#'+s.id===location.hash);}
  window.addEventListener('hashchange',()=>{const i=hashIndex();if(i>=0)navigate(i,{writeHash:false});});
  window.addEventListener('resize',()=>{if(!mobile()&&drawer)setDrawer(false,false);updateInert();});
  let scrollFrame=false;
  window.addEventListener('scroll',()=>{
    if(!readAll||scrollFrame)return;scrollFrame=true;
    requestAnimationFrame(()=>{scrollFrame=false;const sections=$$('.slide');let current=0;for(let i=0;i<sections.length;i++){if(sections[i].getBoundingClientRect().top<160)current=i;}
      if(current!==index){index=current;updateControls();persist();history.replaceState(null,'','#'+slides[index].id);}
    });
  },{passive:true});
  const initial=hashIndex();index=initial>=0?initial:Math.max(0,Math.min(slides.length-1,Number(saved.index)||0));
  syncMode();updateInert();
  if(initial<0&&index>0)toast('已回到上次閱讀的位置');
})();
