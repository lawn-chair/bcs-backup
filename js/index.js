/*! bcs-backup - v0.1.0 - 2014-03-10 */function backupProcess(a,b,c){var d={id:b,win:[{},{},{},{}],timer:[{},{},{},{}],state:[{},{},{},{},{},{},{},{}]};async.parallel([function(c){$.get(a.url+"/api/process/"+b,function(a){d.process=a,c()})},function(c){async.times(8,function(c,e){async.series([function(e){$.get(a.url+"/api/process/"+b+"/state/"+c,function(a){d.state[c].state=a,e()})},function(e){async.each(["exit_conditions","output_controllers","boolean_outputs"],function(e,f){$.get(a.url+"/api/process/"+b+"/state/"+c+"/"+e,function(a){d.state[c][e]=a,f()})},function(){e()})}],function(){e()})},c)},function(c){async.times(4,function(c,e){$.get(a.url+"/api/process/"+b+"/win/"+c,function(a){d.win[c]=a,e()})},c)},function(c){async.times(4,function(c,e){$.get(a.url+"/api/process/"+b+"/timer/"+c,function(a){d.timer[c]=a,e()})},c)}],function(){c(d)})}function backupSystem(a,b){var c={};async.parallel([function(b){async.each(["device","system","network"],function(b,d){$.get(a.url+"/api/"+b,function(a){c[b]=a,d()})},b)},function(b){c.temp=[],async.times(a.probeCount,function(b,d){c.temp.push({}),$.get(a.url+"/api/temp/"+b,function(a){c.temp[b]=a,d()})},b)},function(b){c.din=[],async.times(a.inputCount,function(b,d){c.din.push({}),$.get(a.url+"/api/din/"+b,function(a){c.din[b]=a,d()})},b)},function(b){c.output=[],async.times(a.outputCount,function(b,d){c.output.push({}),$.get(a.url+"/api/output/"+b,function(a){c.output[b]=a,d()})},b)},function(b){c.pid=[],async.times(a.probeCount,function(b,d){c.pid.push({}),$.get(a.url+"/api/pid/"+b,function(a){c.pid[b]=a,d()})},b)},function(b){c.igniter=[],async.times(3,function(b,d){c.igniter.push({}),$.get(a.url+"/api/igniter/"+b,function(a){c.igniter[b]=a,d()})},b)},function(b){c.ladder=[],async.times(40,function(b,d){c.ladder.push({}),$.get(a.url+"/api/ladder/"+b,function(a){c.ladder[b]=a,d()})},b)}],function(){b(c)})}function restoreSystem(a,b,c){async.parallel([function(c){async.each(["device","system","network"],function(c,d){$.post(a.url+"/api/"+c,JSON.stringify(b[c]),function(){d()}).fail(function(){console.log("failure"),d()})},c)},function(c){async.times(a.probeCount,function(c,d){b.temp.length>c&&$.post(a.url+"/api/temp/"+c,JSON.stringify(b.temp[c]),function(){d()}).fail(function(){console.log("failure"),d()})},c)},function(c){async.times(a.inputCount,function(c,d){b.din.length>c&&$.post(a.url+"/api/din/"+c,JSON.stringify(b.din[c]),function(){d()}).fail(function(){console.log("failure"),d()})},c)},function(c){async.times(a.outputCount,function(c,d){b.output.length>c&&$.post(a.url+"/api/output/"+c,JSON.stringify(b.output[c]),function(){d()}).fail(function(){console.log("failure"),d()})},c)},function(c){async.times(a.probeCount,function(c,d){b.pid.length>c&&$.post(a.url+"/api/pid/"+c,JSON.stringify(b.pid[c]),function(){d()}).fail(function(){console.log("failure"),d()})},c)},function(c){async.times(3,function(c,d){$.post(a.url+"/api/igniter/"+c,JSON.stringify(b.igniter[c]),function(){d()}).fail(function(){console.log("failure"),d()})},c)},function(c){async.times(40,function(c,d){$.post(a.url+"/api/ladder/"+c,JSON.stringify(b.ladder[c]),function(){d()}).fail(function(){console.log("failure"),d()})},c)}],function(){c(b)})}function restoreProcess(a,b,c,d){async.parallel([function(d){$.post(a.url+"/api/process/"+b,JSON.stringify(c.process),function(){d()}).fail(function(){console.log("failure"),d()})},function(d){async.times(8,function(d,e){async.series([function(e){$.post(a.url+"/api/process/"+b+"/state/"+d,JSON.stringify(c.state[d].state),function(){e()}).fail(function(){console.log("failure"),e()})},function(e){async.each(["exit_conditions","output_controllers","boolean_outputs"],function(e,f){$.post(a.url+"/api/process/"+b+"/state/"+d+"/"+e,JSON.stringify(c.state[d][e]),function(){f()}).fail(function(){console.log("failure"),f()})},function(){e()})}],e)},d)},function(d){async.times(4,function(d,e){$.post(a.url+"/api/process/"+b+"/win/"+d,JSON.stringify(c.win[d]),function(){e()}).fail(function(){console.log("failure"),e()})},d)},function(d){async.times(4,function(d,e){$.post(a.url+"/api/process/"+b+"/timer/"+d,JSON.stringify(c.timer[d]),function(){e()}).fail(function(){console.log("failure"),e()})},d)}],function(){d()})}$(document).ready(function(){var a,b,c={version:null,url:null,get probeCount(){return"BCS-460"===this.version?6:8},get inputCount(){return"BCS-460"===this.version?4:8},get outputCount(){return"BCS-460"===this.version?6:18}};$("[data-name=bcs]").on("change",function(b){$.get(b.target.value+"/api/device",function(d){"4.0.0"===d.version?(c.version=d.type,c.url=b.target.value,localStorage["bcs-backup.url"]=c.url,$("[data-name=bcs]").parent().addClass("has-success").removeClass("has-error"),$("button#backup").removeClass("disabled"),a=[],async.times(8,function(c,d){$.get(b.target.value+"/api/process/"+c,function(b){a.push({id:c,name:b.name}),d()})},function(){a.sort(function(a,b){return a.id-b.id}),"backup"===b.target.dataset.tab&&(a.forEach(function(a){$("[data-name=process][data-id="+a.id+"]").parent().contents().filter(function(){return 3===this.nodeType}).first().replaceWith(a.name)}),$("#backup-options").removeClass("hide"))})):($("[data-name=bcs]").parent().addClass("has-error").removeClass("has-success"),$("#options").addClass("hide"),$("button").addClass("disabled"))}).fail(function(){$("[data-name=bcs]").parent().addClass("has-error").removeClass("has-success"),$("#backup-options").addClass("hide")})}),$("[data-name=backupFile]").on("change",function(d){var e,f=d.target.files[0];console.log(f.type),e=new FileReader,e.addEventListener("load",function(d){if(b=JSON.parse(d.target.result),b.system&&b.system.device){if($("#restore-options").removeClass("hide"),b.system.device.type===c.version)$("#version-warning").addClass("hide"),$("[data-name=backupFile]").parent().addClass("has-success").removeClass("has-error").removeClass("has-warning");else{if(!b.system.device.type.match(/^BCS\-46/))return $("[data-name=backupFile]").parent().addClass("has-error").removeClass("has-warning").removeClass("has-success"),void $("#version-warning").addClass("hide");$("[data-name=backupFile]").parent().addClass("has-warning").removeClass("has-error").removeClass("has-success"),$("#version-warning").removeClass("hide")}b.system.system&&$("<label>",{"class":"checkbox"}).text("System Settings").append($("<input>",{type:"checkbox","data-name":"system",checked:"checked"})).appendTo($("#restore-options"));var e=$("<select>",{"data-name":"processDest"});a.forEach(function(a){e.append($("<option>",{value:a.id}).text(a.name))}),$("<div>",{"class":"restoreOption"}).append($("<span>").text("Backed Up Process")).append($("<span>",{"class":"pull-right"}).text("Process to Replace")).appendTo($("#restore-options")),b.processes.forEach(function(a,b){$("<div>",{"class":"restoreOption"}).append($("<label>",{"class":"checkbox"}).text(a.process.name).append($("<input>",{type:"checkbox","data-name":"process","data-id":b,checked:"checked"}))).append(e.clone().attr("data-id",b).val(a.id)).appendTo($("#restore-options"))}),$("button#restore").removeClass("disabled")}}),e.readAsText(f)}),localStorage["bcs-backup.url"]&&($("[data-name=bcs]").val(localStorage["bcs-backup.url"]),$("[data-name=bcs][data-tab=backup]").change()),$("button#restore").on("click",function(a){a.preventDefault();var d,e=$("#dialog .modal-body"),f=95/($("#restore-options [data-name=process]:checked").length+$("#restore-options [data-name=system]:checked").length);e.empty(),e.append($("#progress").html()),$("#dialog h4.modal-title").text("Restoring..."),$("#dialog").modal("show"),d=e.find(".progress-bar-success")[0],$(d).attr("aria-valuenow",5),$(d).css("width",$(d).attr("aria-valuenow")+"%"),async.series([function(a){$("#restore-options [data-name=system]:checked").length>0?restoreSystem(c,b.system,function(){$(d).attr("aria-valuenow",parseFloat($(d).attr("aria-valuenow"))+f),$(d).css("width",$(d).attr("aria-valuenow")+"%"),a()}):a()},function(a){async.each($("#restore-options [data-name=process]:checked"),function(a,e){restoreProcess(c,$("[data-name=processDest][data-id="+a.dataset.id+"]").val(),b.processes[a.dataset.id],function(){$(d).attr("aria-valuenow",parseFloat($(d).attr("aria-valuenow"))+f),$(d).css("width",$(d).attr("aria-valuenow")+"%"),e()})},a)}],function(){console.log(b),$("#dialog").modal("hide")})}),$("button#backup").on("click",function(a){a.preventDefault();var b,d={processes:[],system:{}},e=95/($("#backup-options [data-name=process]:checked").length+1),f=$("#dialog .modal-body");f.empty(),f.append($("#progress").html()),$("#dialog h4.modal-title").text("Backing Up..."),$("#dialog").modal("show"),b=f.find(".progress-bar-success")[0],$(b).attr("aria-valuenow",5),$(b).css("width",$(b).attr("aria-valuenow")+"%"),async.series([function(a){async.each($("#backup-options [data-name=process]:checked"),function(a,f){backupProcess(c,a.dataset.id,function(a){d.processes.push(a),$(b).attr("aria-valuenow",parseFloat($(b).attr("aria-valuenow"))+e),$(b).css("width",$(b).attr("aria-valuenow")+"%"),f()})},a)},function(a){$("#backup-options [data-name=system]:checked").length>0?backupSystem(c,function(c){d.system=c,$(b).attr("aria-valuenow",parseFloat($(b).attr("aria-valuenow"))+e),$(b).css("width",$(b).attr("aria-valuenow")+"%"),a()}):$.get(c.url+"/api/device",function(c){d.system.device=c,$(b).attr("aria-valuenow",parseFloat($(b).attr("aria-valuenow"))+e),$(b).css("width",$(b).attr("aria-valuenow")+"%"),a()})}],function(){var a=new Blob([JSON.stringify(d)],{type:"text/plain;charset=utf-8"});saveAs(a,"bcs-backup.json"),$("#dialog").modal("hide")})})});