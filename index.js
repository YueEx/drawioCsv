Draw.loadPlugin(function (ui) {
  // const app = document.getElementById("app");

  // the whole container part
  const container = document.createElement("div");
  container.style.border = "1px solid black";
  container.style.height = "350px";
  container.style.width = "400px";
  container.style.padding = "5px";
  container.style.fontSize = "14px";
  //   container.style.backgroundColor = "lightgrey";
  // app.appendChild(container);

  const dataUploader = document.createElement("form");
  dataUploader.style.margin = "10px 0px 10px 0px";
  dataUploader.style.height = "5%";
  dataUploader.id = "dataUploader";
  dataUploader.enctype = "multipart/form-data";
  dataUploader.innerHTML = `
<input type="file" id="myFile" name="myFile" required/>
<select name="csvSeperator" id="csvSeperator">
  <option value=",">,</option>
  <option value=";">;</option>
</select>

<input type="number" id="startRow" name="startRow" style="width:40px" value="1" required min="1">

<input type="submit" name="submit">
`;

  container.appendChild(dataUploader);

  const csvDiv = document.createElement("div");
  csvDiv.style.overflow = "auto";
  csvDiv.style.width = "400px";
  csvDiv.style.height = "300px";

  container.appendChild(csvDiv);

  var csvTitle = document.createElement("p");
  csvTitle.innerHTML =
    "Below shows the csv table, please choose seperator(, or ;) and starting row(number).";
  var csvTable = document.createElement("table");
  csvTable.name = "csvTable";
  csvTable.style.borderCollapse = "collapse";
  //   csvTable.style.overflow = "auto";
  csvTable.style.width = "100%";
  csvTable.style.height = "100%";
  //   csvTable.style.tableLayout = "auto";

  csvDiv.appendChild(csvTitle);
  csvDiv.appendChild(csvTable);
  var csvArray = null;

  dataUploader.addEventListener("submit", (evt) => {
    evt.preventDefault();
    const formData = new FormData(evt.target);
    const file = formData.get("myFile");
    const delimiter = formData.get("csvSeperator");
    const startRow = formData.get("startRow");
    const reader = new FileReader();
    const filename = file.name;
    reader.onload = (event) => {
      console.log(event.target);
      csvTitle.innerHTML = filename;
      const resultArray = csvToArray(event.target.result, delimiter, startRow);
      csvArray = resultArray;
      csvTable.innerHTML = buildHtmlTable(csvArray).innerHTML;
      delBtnListner();
      // rowBtnListner();
      colBtnListner();
    };
    reader.readAsText(file);
  });

  const csvToArray = (str, delimiter, startRow) => {
    const strings = str.trim().split("\n");
    const sliceNumber = Number(startRow) - 1;
    const headers = strings
      .slice(sliceNumber, sliceNumber + 1)[0]
      .split(delimiter);

    const rows = strings.slice(sliceNumber + 1);
    var table_row_id = 1;

    const arr = rows.map((row) => {
      const values = row.split(delimiter);
      const el = headers.reduce((object, header, index) => {
        object["id"] = "r" + table_row_id;
        object[header.trim()] = values[index].trim();

        return object;
      }, {});
      table_row_id += 1;
      return el;
    });
    return arr;
  };

  var _table_ = document.createElement("table"),
    _tr_ = document.createElement("tr"),
    _th_ = document.createElement("th"),
    _td_ = document.createElement("td");

  const buildHtmlTable = (arr) => {
    var table = _table_.cloneNode(false),
      columns = addAllColumnHeaders(arr, table);
    for (var i = 0, maxi = arr.length; i < maxi; ++i) {
      var tr = _tr_.cloneNode(false);
      var buttonTd = _td_.cloneNode(false);
      var btn = document.createElement("button");
      btn.id = arr[i][columns[0]];
      btn.innerText = "—";
      btn.name = "delBtn";
      btn.style.padding = "0px";
      buttonTd.appendChild(btn);
      tr.appendChild(buttonTd);
      // row button
      // var rBtn = document.createElement("button");
      // rBtn.id = "out" + arr[i][columns[0]];
      // rBtn.innerText = "▲";
      // rBtn.name = "rowBtn";
      // rBtn.style.padding = "0px";
      // rBtn.style.marginLeft = "1px";
      // buttonTd.appendChild(rBtn);
      // buttonTd.style.display = "flex";
      // buttonTd.style.flexDirection = "row";
      for (var j = 0, maxj = columns.length; j < maxj; ++j) {
        var td = _td_.cloneNode(false);
        cellValue = arr[i][columns[j]];
        td.appendChild(document.createTextNode(arr[i][columns[j]] || ""));
        td.style.border = "1px solid black";
        tr.appendChild(td);
      }
      tr.style.border = "1px solid black";

      table.appendChild(tr);
    }

    return table;
  };

  const addAllColumnHeaders = (arr, table) => {
    var columnSet = [],
      tr = _tr_.cloneNode(false);
    var emptyTh = _th_.cloneNode(false);
    emptyTh.style.border = "1px solid black";
    tr.appendChild(emptyTh);

    for (var i = 0, l = arr.length; i < l; i++) {
      for (var key in arr[i]) {
        if (arr[i].hasOwnProperty(key) && columnSet.indexOf(key) === -1) {
          columnSet.push(key);
          var th = _th_.cloneNode(false);
          var colGroup = document.createElement("div");
          colGroup.style.display = "flex";
          colGroup.style.flexDirection = "row";

          var colBtn = document.createElement("button");
          // colBtn.type = "button";
          colBtn.innerText = "▲";
          colBtn.name = "colBtn";
          colBtn.id = key.trim();
          colBtn.style.padding = "0px";
          colBtn.style.marginRight = "1px";

          colGroup.appendChild(colBtn);
          colGroup.appendChild(document.createTextNode(key));
          th.appendChild(colGroup);
          th.style.border = "1px solid black";
          //   colGroup.style.whiteSpace = "nowrap";

          tr.appendChild(th);
        }
      }
    }
    tr.style.border = "1px solid black";
    table.appendChild(tr);
    return columnSet;
  };

  const updateTable = (evt) => {
    csvArray = csvArray.filter((arr) => arr.id !== evt.target.id);
    csvTable.innerHTML = buildHtmlTable(csvArray).innerHTML;
    delBtnListner();
    // rowBtnListner();
    colBtnListner();
  };

  const delBtnListner = () => {
    const btns = document.getElementsByName("delBtn");
    for (let i = 0; i < btns.length; i++) {
      btns[i].addEventListener("click", updateTable);
    }
  };

  // const rowBtnListner = () => {
  //   const btns = document.getElementsByName("rowBtn");
  //   for (let i = 0; i < btns.length; i++) {
  //     btns[i].addEventListener("click", outPutRow);
  //   }
  // };

  const colBtnListner = () => {
    const btns = document.getElementsByName("colBtn");
    for (let i = 0; i < btns.length; i++) {
      btns[i].addEventListener("click", outPutCol);
    }
  };

  // const outPutRow = (evt) => {
  //   selectedRow = csvArray.filter((arr) => "out" + arr.id === evt.target.id)[0];
  //   console.log(selectedRow);
  // };

  const outPutCol = (evt) => {
    var colCell = new mxCell(
      evt.target.id,
      new mxGeometry(0, 0, 90, 26),
      "shape=partialRectangle;spacingTop=-2;spacingLeft=4;spacingRight=4"
    );
    var maxNameLength = evt.target.id.length;

    var size = ui.editor.graph.getPreferredSizeForCell(colCell);
    colCell.geometry.width = size.width + maxNameLength;
    // convert value to a node
    // var addProperty = ui.editor.graph.getModel().getValue(tableCell);

    var doc = mxUtils.createXmlDocument();
    var obj = doc.createElement("object");
    obj.setAttribute("label", evt.target.id || "");
    var propertyObj = obj;

    // addProperty = addProperty.cloneNode(true);
    // propertyObj.setAttribute("fds", "life");
    propertyObj.setAttribute("MappingID", evt.target.id);

    csvArray.forEach((value) => {
      var colID = value.id;
      var colValue = value[evt.target.id];

      propertyObj.setAttribute(colID, colValue);
    });

    ui.editor.graph.getModel().setValue(colCell, propertyObj);

    const cellGround = [colCell];
    colCell.vertex = true;
    var graph = ui.editor.graph;
    var view = graph.view;
    var bds = graph.getGraphBounds();

    // Computes unscaled, untranslated graph bounds
    var x = Math.ceil(
      Math.max(0, bds.x / view.scale - view.translate.x) + 4 * graph.gridSize
    );
    var y = Math.ceil(
      Math.max(0, (bds.y + bds.height) / view.scale - view.translate.y) +
        4 * graph.gridSize
    );

    graph.importCells(cellGround, x, y);
  };

  mxUtils.br(container);

  mxResources.parse("importCSV=import CSV");

  var wnd = new mxWindow(
    mxResources.get("importCSV"),
    container,
    document.body.offsetWidth - 480,
    140,
    410,
    380,
    true,
    true
  );
  wnd.destroyOnClose = false;
  wnd.setMaximizable(false);
  wnd.setResizable(false);
  wnd.setClosable(true);
  wnd.setVisible(false);

  ui.actions.addAction("importCSV", function () {
    wnd.setVisible(!wnd.isVisible());
  });

  var menu = ui.menus.get("extras");
  var oldFunct = menu.funct;

  menu.funct = function (menu, parent) {
    oldFunct.apply(this, arguments);

    ui.menus.addMenuItems(menu, ["importCSV"], parent);
  };
});

