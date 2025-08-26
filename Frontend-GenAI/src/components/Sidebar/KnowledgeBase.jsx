import  { useState } from 'react';

const KnowledgeBase = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    
    const categories = [
        { id: 'all', name: 'All Topics', icon: 'quiz', count: 45 },
        { id: 'policies', name: 'Company Policies', icon: 'policy', count: 12 },
        { id: 'procedures', name: 'Procedures', icon: 'list_alt', count: 18 },
        { id: 'technical', name: 'Technical Docs', icon: 'engineering', count: 8 },
        { id: 'hr', name: 'HR Guidelines', icon: 'people', count: 7 }
    ];

    const articles = [
        {
            id: 1,
            title: 'Employee Code of Conduct',
            category: 'policies',
            summary: 'Comprehensive guide to professional behavior and ethical standards',
            views: 1200,
            lastUpdated: '2025-01-15',
            tags: ['ethics', 'behavior', 'guidelines'],
            difficulty: 'beginner'
        },
        {
            id: 2,
            title: 'Data Security Protocols',
            category: 'technical',
            summary: 'Best practices for handling sensitive company information',
            views: 850,
            lastUpdated: '2025-02-01',
            tags: ['security', 'data', 'protocols'],
            difficulty: 'advanced'
        },
        {
            id: 3,
            title: 'Remote Work Guidelines',
            category: 'hr',
            summary: 'Policies and procedures for remote work arrangements',
            views: 950,
            lastUpdated: '2025-01-20',
            tags: ['remote', 'work', 'policy'],
            difficulty: 'beginner'
        },
        {
            id: 4,
            title: 'API Integration Guide',
            category: 'technical',
            summary: 'Step-by-step guide for integrating with company APIs',
            views: 420,
            lastUpdated: '2025-02-10',
            tags: ['api', 'integration', 'development'],
            difficulty: 'expert'
        }
    ];

    const filteredArticles = articles.filter(article => {
        const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            article.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2] p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-[#00796b] text-3xl">psychology</span>
                            <div>
                                <h1 className="text-3xl font-bold text-[#004d40] font-verdana">Knowledge Base</h1>
                                <p className="text-gray-600">Find answers and learn about company processes</p>
                            </div>
                        </div>
                        <button className="bg-[#00796b] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#004d40] transition-colors duration-200 flex items-center gap-2">
                            <span className="material-symbols-outlined">add</span>
                            Add Article
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
                            search
                        </span>
                        <input
                            type="text"
                            placeholder="Search articles, guides, and documentation..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00796b] focus:border-transparent"
                        />
                    </div>
                    <div className="flex gap-2 mt-4">
                        <span className="text-sm text-gray-600">Popular searches:</span>
                        {['policies', 'security', 'remote work', 'API'].map(term => (
                            <button
                                key={term}
                                onClick={() => setSearchTerm(term)}
                                className="text-sm text-[#00796b] hover:underline"
                            >
                                {term}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Categories Sidebar */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-lg font-semibold text-[#004d40] mb-4">Categories</h3>
                        <div className="space-y-2">
                            {categories.map(category => (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors duration-200 ${
                                        selectedCategory === category.id 
                                            ? 'bg-[#00796b] text-white' 
                                            : 'hover:bg-gray-100 text-gray-700'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-xl">{category.icon}</span>
                                        <span className="font-medium">{category.name}</span>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                        selectedCategory === category.id ? 'bg-white text-[#00796b]' : 'bg-gray-200 text-gray-600'
                                    }`}>
                                        {category.count}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Quick Stats */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <h4 className="text-sm font-semibold text-gray-600 mb-3">QUICK STATS</h4>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span>Total Articles</span>
                                    <span className="font-semibold text-[#00796b]">45</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Most Viewed</span>
                                    <span className="font-semibold text-[#00796b]">Code of Conduct</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Last Updated</span>
                                    <span className="font-semibold text-[#00796b]">Today</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Articles List */}
                    <div className="lg:col-span-3 space-y-6">
                        {filteredArticles.map(article => (
                            <div key={article.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-semibold text-[#004d40] hover:text-[#00796b] cursor-pointer">
                                                {article.title}
                                            </h3>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                article.difficulty === 'beginner' ? 'bg-green-100 text-green-600' :
                                                article.difficulty === 'advanced' ? 'bg-yellow-100 text-yellow-600' :
                                                'bg-red-100 text-red-600'
                                            }`}>
                                                {article.difficulty}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 mb-3">{article.summary}</p>
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-xs">visibility</span>
                                                <span>{article.views} views</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-xs">schedule</span>
                                                <span>Updated {article.lastUpdated}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-xs">category</span>
                                                <span>{categories.find(c => c.id === article.category)?.name}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 ml-4">
                                        <button className="p-2 text-gray-500 hover:text-[#00796b] hover:bg-gray-100 rounded-lg transition-colors duration-200">
                                            <span className="material-symbols-outlined">bookmark_add</span>
                                        </button>
                                        <button className="p-2 text-gray-500 hover:text-[#00796b] hover:bg-gray-100 rounded-lg transition-colors duration-200">
                                            <span className="material-symbols-outlined">share</span>
                                        </button>
                                    </div>
                                </div>
                                
                                {/* Tags */}
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-sm text-gray-500">Tags:</span>
                                    {article.tags.map(tag => (
                                        <span
                                            key={tag}
                                            className="px-2 py-1 bg-[#e0f2f1] text-[#00796b] text-xs rounded-full cursor-pointer hover:bg-[#00796b] hover:text-white transition-colors duration-200"
                                            onClick={() => setSearchTerm(tag)}
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3">
                                    <button className="bg-[#00796b] text-white px-4 py-2 rounded-lg hover:bg-[#004d40] transition-colors duration-200">
                                        Read Article
                                    </button>
                                    <button className="border border-[#00796b] text-[#00796b] px-4 py-2 rounded-lg hover:bg-[#00796b] hover:text-white transition-colors duration-200">
                                        Quick Preview
                                    </button>
                                </div>
                            </div>
                        ))}

                        {filteredArticles.length === 0 && (
                            <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                                <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">search_off</span>
                                <h3 className="text-xl font-semibold text-gray-600 mb-2">No articles found</h3>
                                <p className="text-gray-500 mb-4">Try adjusting your search terms or browse different categories.</p>
                                <button className="bg-[#00796b] text-white px-6 py-3 rounded-lg hover:bg-[#004d40] transition-colors duration-200">
                                    Browse All Articles
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KnowledgeBase;
