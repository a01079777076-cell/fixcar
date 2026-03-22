"use client";
import { useRef, useState } from "react";
import { Bold, Italic, Underline, AlignLeft, AlignCenter, List, Image, Type, Palette } from "lucide-react";

interface Props {
  value: string;
  onChange: (html: string) => void;
  onImageUpload?: (url: string) => void;
}

export default function BlogEditor({ value, onChange, onImageUpload }: Props) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [uploading, setUploading] = useState(false);
  const [showColors, setShowColors] = useState(false);
  const [showFontSize, setShowFontSize] = useState(false);

  const exec = (cmd: string, val?: string) => {
    document.execCommand(cmd, false, val);
    syncContent();
  };

  const syncContent = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleImageUpload = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (data.url) {
          exec("insertHTML", `<img src="${data.url}" style="max-width:100%;border-radius:8px;margin:12px 0;" />`);
          onImageUpload?.(data.url);
        } else {
          alert("업로드 실패: " + (data.error || "다시 시도해주세요"));
        }
      } catch { alert("업로드 중 오류"); }
      setUploading(false);
    };
    input.click();
  };

  const COLORS = ["#1A1A1A","#FF3B1E","#1847FF","#2D8A52","#E8A020","#9B30FF","#888888"];
  const SIZES = [{label:"작게",val:"2"},{label:"보통",val:"3"},{label:"크게",val:"5"},{label:"아주 크게",val:"7"}];

  const ToolBtn = ({onClick,active,children,title}:{onClick:()=>void;active?:boolean;children:React.ReactNode;title:string}) => (
    <button onClick={onClick} title={title} style={{
      padding:"6px 8px",border:"none",borderRadius:6,cursor:"pointer",
      background:active?"#E8E6E1":"transparent",color:"#555",display:"flex",alignItems:"center",
      fontFamily:"'NanumSquareRound',sans-serif",
    }}>{children}</button>
  );

  return (
    <div style={{border:"1.5px solid #E0DDD7",borderRadius:14,overflow:"hidden",background:"white"}}>
      {/* 툴바 */}
      <div style={{display:"flex",flexWrap:"wrap",gap:2,padding:"8px 10px",borderBottom:"1px solid #F0EEE9",background:"#FAFAF8",alignItems:"center"}}>
        <ToolBtn onClick={()=>exec("bold")} title="굵게"><Bold size={16}/></ToolBtn>
        <ToolBtn onClick={()=>exec("italic")} title="기울임"><Italic size={16}/></ToolBtn>
        <ToolBtn onClick={()=>exec("underline")} title="밑줄"><Underline size={16}/></ToolBtn>
        <div style={{width:1,height:20,background:"#E0DDD7",margin:"0 4px"}}/>
        <ToolBtn onClick={()=>exec("justifyLeft")} title="왼쪽 정렬"><AlignLeft size={16}/></ToolBtn>
        <ToolBtn onClick={()=>exec("justifyCenter")} title="가운데 정렬"><AlignCenter size={16}/></ToolBtn>
        <ToolBtn onClick={()=>exec("insertUnorderedList")} title="목록"><List size={16}/></ToolBtn>
        <div style={{width:1,height:20,background:"#E0DDD7",margin:"0 4px"}}/>

        {/* 글자 크기 */}
        <div style={{position:"relative"}}>
          <ToolBtn onClick={()=>{setShowFontSize(!showFontSize);setShowColors(false);}} title="글자 크기"><Type size={16}/></ToolBtn>
          {showFontSize&&(
            <div style={{position:"absolute",top:"100%",left:0,background:"white",borderRadius:10,boxShadow:"0 4px 20px rgba(0,0,0,0.15)",padding:6,zIndex:10}}>
              {SIZES.map(s=>(
                <button key={s.val} onClick={()=>{exec("fontSize",s.val);setShowFontSize(false);}} style={{
                  display:"block",width:"100%",padding:"8px 16px",border:"none",background:"transparent",
                  fontSize:13,fontWeight:600,color:"#333",textAlign:"left",cursor:"pointer",borderRadius:6,
                  fontFamily:"'NanumSquareRound',sans-serif",
                }}>{s.label}</button>
              ))}
            </div>
          )}
        </div>

        {/* 글자 색상 */}
        <div style={{position:"relative"}}>
          <ToolBtn onClick={()=>{setShowColors(!showColors);setShowFontSize(false);}} title="글자 색상"><Palette size={16}/></ToolBtn>
          {showColors&&(
            <div style={{position:"absolute",top:"100%",left:0,background:"white",borderRadius:10,boxShadow:"0 4px 20px rgba(0,0,0,0.15)",padding:8,zIndex:10,display:"flex",gap:4}}>
              {COLORS.map(c=>(
                <button key={c} onClick={()=>{exec("foreColor",c);setShowColors(false);}} style={{
                  width:24,height:24,borderRadius:"50%",border:"2px solid #E8E6E1",background:c,cursor:"pointer",
                }}/>
              ))}
            </div>
          )}
        </div>

        <div style={{width:1,height:20,background:"#E0DDD7",margin:"0 4px"}}/>
        <ToolBtn onClick={handleImageUpload} title="이미지 삽입"><Image size={16}/> {uploading&&<span style={{fontSize:11,marginLeft:4}}>업로드중...</span>}</ToolBtn>
      </div>

      {/* 에디터 영역 */}
      <div
        ref={editorRef}
        contentEditable
        onInput={syncContent}
        dangerouslySetInnerHTML={{ __html: value }}
        style={{
          minHeight:300,padding:"18px 22px",fontSize:15,lineHeight:1.9,color:"#333",
          outline:"none",fontFamily:"'NanumSquareRound',sans-serif",
        }}
      />
    </div>
  );
}
