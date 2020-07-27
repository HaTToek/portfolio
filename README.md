# emfndhk
<html>
<head>
<title>준짱의 수업</title>
<meta charset="utf=8">
</head>
<body>
<h2>준짱 is <strong>very grumpy</strong></h2>
<p><a href="https://github.com/HaTToek/emfndhk/blob/master/README.md" title="준짱은 매우 사납다" target="_blank">준짱</a></p>
<p> href와 title, target은 a로 묵이며 href는 웹주소와 연결 title은 정보 target은 링크가 현제 탭에서 열릴지 새탭에서 열릴지 말해준다 현제 탭은 생략</p>
<input type="text" disabled="disabled">
<p>input type="text" disabled="disabled"</p>
<p>input type ="text" disabled<br>
input type="text"로 줄여쓸수있다.<br>
'와 "를 사용가능하고 생략가능하다</p>

<h2>준짱</h2>
<ul>
<li><em>준준짱</em></il>
<li>준짱짱</il>
</ul>
<ol>
<li>준준짱</il>
<li>준짱짱</il>
</ol>
<p>리스트 형식으로 표현가능하다. ul, ol이 있고 ul은 순서없는 리스트 ol은 순서가있는 리슽트이다 em,strong은 강조</p>

<dl>
<dt>wnsWKd</dt>
<dd>준짱<sup>준짱</sup>은 매우 사납다</dd>
</dl>
<table border="2">
    <thead>
        <tr>
            <th>갓</th>  
            <th>준</th>  
            <th>영</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>준</td>
            <td>영</td>
            <td>갓</td>
        </tr>
    </tbody>
    <tfoot>
        <tr>
            <td>영</td> 
            <td>갓</td> 
            <td>준</td>
        </tr>
    </tfoot>
</table>
<form action="">
<p>text:<input type ="text" name="id" value="default value"></p>
<p>test:<textarea cols="50" rows="2">default value</textarea></p>
</form>

<form action="http://localhost/order.php">
    <h1>준상</h1>
        <select name="준짱">
            <option value="1">준준짱</option>
            <option value="2">준짱짱</option>
        </select>
    <h1>준상2</h1>
        <select name="준상2" multiple>
            <option value="3">준준상</option>
            <option value="4">준상상</option>
        </select>
    <input type="submit">
    <p>
        <h1>준상3(딴일 선택)</h1>
        비제이 : <input type="radio" name="work" value="bj">
        유튜버 : <input type="radio" name="work" value="youtuber" checked>
    </p>
    <p>
        <h1>준이즈(나중선택)</h1>
            회사원 : <input type="checkbox" name="later select" value="worker">
            사업가 : <input type="checkbox" name="later select" value="..." checked>
    </p>
    <input type="submit">
</form>
         <form action="http://localhost/form.php">
            <input type="text">
            <input type="submit" value="전송">
            <input type="button" value="버튼" onclick="alert('hello world')">
            <input type="reset">
        </form>


<form action="">
    <input type="text" name="id">
    <input type="hidden" name="hide" value="egoing">
    <input type="submit">
</form>

</body>
</html>
