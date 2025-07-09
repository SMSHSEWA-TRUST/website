import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';

interface BlogArticle {
    date?: string;
    title?: string;
}

interface BlogSectionProps {
    articles?: BlogArticle[];
}

export const BlogSection: React.FC<BlogSectionProps> = ({
    articles = [
        { date: "", title: "" },
        { date: "", title: "" },
        { date: "", title: "" },
    ]
}) => {
    return (
        <section className="flex gap-[20px] mt-[193px] mx-[80px]">
            {articles.map((article, index) => (
                <Card
                    key={index}
                    className="w-[413px] h-[276px] bg-[url(/ganesh.png)] bg-cover bg-[50%_50%] rounded-none border-none"
                >
                    <CardContent className="relative z-20 flex flex-col justify-end h-full p-6">
                        <div className="text-white text-xs mb-1">{article.date || "Jan 01, 2025"}</div>
                        <div className="text-[#daa520] text-lg font-semibold mb-3 [font-family:'Marcellus',Helvetica]">
                            {article.title || "Lorem ipsum dolor sit"}
                        </div>
                        <Button className="w-[110px] h-[32px] bg-[#8b0000] rounded-none text-white text-xs">
                            Read Articles
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </section>
    );
}; 