(this.webpackJsonpcc_app=this.webpackJsonpcc_app||[]).push([[0],[,,,,function(e,t,n){e.exports=n.p+"static/media/logo_kibana_32_color.752a9559.svg"},function(e,t,n){e.exports=n(11)},,,,,function(e,t,n){},function(e,t,n){"use strict";n.r(t);var r=n(0),a=n.n(r),c=n(3),o=n.n(c),u=n(4),i=n.n(u);function l(e){var t=e.url;return a.a.createElement("header",{className:"App-header"},a.a.createElement("a",{className:"App-link",href:t,target:"_blank",rel:"noopener noreferrer"},a.a.createElement("img",{src:i.a,className:"App-logo",alt:"logo",style:{height:20,width:20}}),"Build Stats"))}var s=n(1);function m(e){var t=e.historicalItem,n=e.testRunnerItem.type,r=function(e){var t="target/kibana-coverage/".concat(e,"-combined/index.html");return function(e){return"".concat("https://storage.cloud.google.com/kibana-ci-artifacts/jobs/elastic%2Bkibana%2Bcode-coverage","/").concat(function(e){return Object(s.a)(/coverage\/(\d*)\/\d*-.*Z/gm.exec(e))[1]}(e),"/").concat(f(e),"/").concat(t)}}(n);return a.a.createElement("div",null,a.a.createElement("div",null,n),a.a.createElement("a",{className:"App-link",href:r(t),target:"_blank",rel:"noopener noreferrer"},f(t)))}function f(e){return Object(s.a)(/coverage\/\d*\/(\d*-.*Z)/gm.exec(e))[1]}function p(e){var t=e.historicalItem,n=e.testRunnerTypes,r=function(e){return function(t){return a.a.createElement(m,{historicalItem:e,testRunnerItem:t,key:t.id})}}(t);return a.a.createElement("div",{className:"App-TestRunner-List"},a.a.createElement("ul",null,"Test Runners",n.map(r)))}var b=function e(t){return{chain:function(e){return e(t)},map:function(n){return e(n(t))},fold:function(e,n){return n(t)},inspect:function(){return"Right(".concat(t,")")}}};b.of=function(e){return b(e)};var d=function e(t){return{chain:function(n){return e(t)},map:function(n){return e(t)},fold:function(e,n){return e(t)},inspect:function(){return"Left(".concat(t,")")}}};d.of=function(e){return d(e)};var v=function(e){try{return b(e())}catch(t){return d(t)}};function h(e){var t=e.item,n=e.currentJobNumber,r=e.currentJobTimeStamp,c=e.testRunnerTypes,o=e.isCurrent;o&&(console.log("\n### currentJobNumber: \n\t".concat(n)),console.log("\n### currentJobTimeStamp: \n\t".concat(r)));var u="max-w-sm rounded overflow-hidden shadow-lg";return a.a.createElement("div",{className:"flex-horizontal-center"},a.a.createElement("div",{className:o?"".concat(u," App-current"):u},a.a.createElement("div",{className:"px-6 py-4"},a.a.createElement("div",{className:"font-bold text-xl mb-2"},function(e,t){return a.a.createElement("a",{className:"App-link",href:(n=t,["https://console.cloud.google.com/storage/browser/",n.replace("gs://","")].join("")),target:"_blank",rel:"noopener noreferrer"},e?"Current Job":"Job"," - ",function(e){return(e.includes("gs://kibana-ci-artifacts")?function(e){return b.of(e)}(e):function(e){return d.of(e)}(e)).fold((function(){return e}),(function(){var t;return(t=e.replace.apply(e,Object(s.a)(["gs://kibana-ci-artifacts/jobs/elastic+kibana+code-coverage/",""]))).replace.apply(t,Object(s.a)([/(\d.*)\/\d.*$/,"$1"]))}))}(t));var n}(o,t)),a.a.createElement("div",{className:"text-gray-700 text-base"},a.a.createElement(p,{historicalItem:t,testRunnerTypes:c})))))}var g=function(e){return function(t){return function(n,r){return a.a.createElement(h,{item:n,key:r,currentJobNumber:t,testRunnerTypes:e})}}};function E(e){var t=e.testRunnerTypes,n=e.historicalItems,r=e.currentJobNumber,c=g(t);return a.a.createElement("div",{className:"font-bold text-xl mb-2 flex-horizontal-center"},a.a.createElement("ul",null,n.reverse().map((function(e,t){return c(r)(e,t)}))))}function y(e){var t=e.testRunnerTypes,n=e.buildStats,r=e.historicalItems,c=e.currentJobTimeStamp,o=e.currentJobNumber,u=e.currentItem,i=n.url;return a.a.createElement("div",null,a.a.createElement(l,{url:i}),a.a.createElement("div",null,a.a.createElement("div",null,a.a.createElement(h,{item:u,currentJobNumber:o,testRunnerTypes:t,isCurrent:!0,currentJobTimeStamp:c})),a.a.createElement(E,{testRunnerTypes:t,historicalItems:r,currentJobNumber:o})))}Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));var N=function(e){return JSON.stringify(e,null,2)},J=(n(10),document.getElementById.bind(document,"root")),k=window.initialData;v((function(){return k})).chain((function(){return v((function(){return k.testRunnerTypes}))})).map((function(e){var t=k.buildStats,n=k.historicalItems,r=k.currentJobNumber,c=k.currentJobTimeStamp,u=k.currentItem;i=k,console.log("\n### initial data: \n\n".concat(N(i))),o.a.render(a.a.createElement(y,{testRunnerTypes:e,buildStats:t,historicalItems:n,currentJobNumber:r,currentJobTimeStamp:c,currentItem:u}),J());var i})),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))}],[[5,1,2]]]);
//# sourceMappingURL=main.2ac17b1f.chunk.js.map