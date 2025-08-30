import { Box, Container, Stack } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
const images = [
    "/img/collections/chains.jpg",
    "/img/collections/rings.jpg",
    "/img/collections/ear hooks.jpg",
    "/img/collections/bracelets.jpg",
    "/img/collections/bangles.jpg",
]


const GorgeousCollection = () => {
  const { t, i18n } = useTranslation('common');
  const [lang, setLang] = useState<string | null>('en');
  return (
    <Stack className="gorgeous_collection_stack"
        
        justifyContent="center"
        alignItems="center"
        sx={{width: "100%", height: "100%"}}>
    <div className="gorgeous_collections">
      
        <Stack 
            justifyContent="space-between"
            alignItems="left"
            sx={{height: "100%",}}  
            className="gorgeous_collection_inner"
            >
               <Box component={'div'} className={'left'}>
                <span>Gorgeous Collections</span>
						</Box>
                
                <div className="bottom_content">
                    <Stack className="bottom_content_stack"
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        sx={{width: "100%", height: "100%"}}>
                        <div className="circle-container">
                          {images.map((src, idx) => {
                          // "ear hooks.jpg" -> "ear hooks"
                          const key = src.split('/').pop()?.split('.')[0] ?? '';

                          return (
                            <div key={idx} className="circle-img-wrapper">
                              <img src={src} alt={t(key)} className="circle-img" />
                              {/* CSS'ingizda allaqachon text-transform: uppercase bor, shu bois toString()ni t(key)ga qo'ying */}
                              <div className="circle-img-label">{t(key)}</div>
                            </div>
                          );
                        })}

                        </div>

                    </Stack>
                </div>
        </Stack>
        
    </div>
    </Stack>
  );
}

export default GorgeousCollection;