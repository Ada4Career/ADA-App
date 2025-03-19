'use client';

import { useQuery } from '@tanstack/react-query';
import { Briefcase, ChevronDown, ChevronRight, Clock } from 'lucide-react';
import { useState } from 'react';
import Tree from 'react-d3-tree';

import api from '@/lib/axios';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import useAuthStore from '@/store/useAuthStore';

import { API_BASE_URL } from '@/constant/config';

import { ApiReturn } from '@/types/api.types';
import { RoleMapResponse } from '@/types/response/ai';

// Define types for our data
// The TreeNode interface can still use the specific level types for internal use
interface TreeNode {
  name: string;
  id: string;
  level: string;
  timeline: string;
  skills: string[];
  children: TreeNode[];
  attributes?: {
    level: string;
  };
}

// Sample data from the API response
const apiResponse = {
  code: 200,
  message: 'Success',
  data: [
    {
      ID: '2e33e9a5-c2c1-4b50-8eea-8d835d6177ab',
      Email: 'bagusdewa@gmail.com',
      Role: 'Team Lead / Engineering Manager',
      Level: 'mid',
      Timeline: '2-5 years',
      SkillsNeeded:
        '["Team management","Conflict resolution","Effective communication","Agile methodologies"]',
      ParentRole: 'Full Stack Software Engineer',
      CreatedAt: '2025-03-03T19:19:53.962Z',
      UpdatedAt: '2025-03-03T19:19:53.962Z',
    },
    {
      ID: '6f031cef-9553-4601-935e-db9c03e21b38',
      Email: 'bagusdewa@gmail.com',
      Role: 'Freelance Full Stack Developer',
      Level: 'mid',
      Timeline: '2-4 years',
      SkillsNeeded:
        '["Self-marketing","Client management","Time management","Networking"]',
      ParentRole: 'Full Stack Software Engineer',
      CreatedAt: '2025-03-03T19:19:53.965Z',
      UpdatedAt: '2025-03-03T19:19:53.965Z',
    },
    {
      ID: 'aa928a86-9dd9-425e-b356-ee0943abd600',
      Email: 'bagusdewa@gmail.com',
      Role: 'Consultant / Technical Advisor',
      Level: 'senior',
      Timeline: '4-6 years',
      SkillsNeeded:
        '["Consultation skills","Business acumen","Continuous learning","Remote communication"]',
      ParentRole: 'Freelance Full Stack Developer',
      CreatedAt: '2025-03-03T19:19:53.966Z',
      UpdatedAt: '2025-03-03T19:19:53.966Z',
    },
    {
      ID: 'c8ece97f-f02f-4566-b7bb-d45670c8a12c',
      Email: 'bagusdewa@gmail.com',
      Role: 'Senior Full Stack Engineer',
      Level: 'mid',
      Timeline: '2-4 years',
      SkillsNeeded:
        '["Leadership skills","Advanced project management","Mentorship capabilities","Enhanced communication skills"]',
      ParentRole: 'Full Stack Software Engineer',
      CreatedAt: '2025-03-03T19:19:53.958Z',
      UpdatedAt: '2025-03-03T19:19:53.958Z',
    },
    {
      ID: 'da429e6d-a59a-4b39-82cd-759cb6e20aff',
      Email: 'bagusdewa@gmail.com',
      Role: 'Technical Architect',
      Level: 'senior',
      Timeline: '4-6 years',
      SkillsNeeded:
        '["Architectural design principles","Strategic planning","Cross-team collaboration","Advanced problem-solving"]',
      ParentRole: 'Senior Full Stack Engineer',
      CreatedAt: '2025-03-03T19:19:53.96Z',
      UpdatedAt: '2025-03-03T19:19:53.96Z',
    },
    {
      ID: 'e1ed2f9f-f2ed-4960-b688-f4ae3c9bbac1',
      Email: 'bagusdewa@gmail.com',
      Role: 'Full Stack Software Engineer',
      Level: 'entry',
      Timeline: '0-2 years',
      SkillsNeeded:
        '["Advanced Python","Advanced JavaScript","Cloud deployment (AWS, Azure)","Data Analysis","CI/CD practices"]',
      ParentRole: '',
      CreatedAt: '2025-03-03T19:19:53.957Z',
      UpdatedAt: '2025-03-03T19:19:53.957Z',
    },
    {
      ID: 'ea78b050-982e-4405-b571-1a096babe04c',
      Email: 'bagusdewa@gmail.com',
      Role: 'Director of Engineering',
      Level: 'expert',
      Timeline: '5-8 years',
      SkillsNeeded:
        '["Strategic visioning","High-level project oversight","Stakeholder engagement","Budget management"]',
      ParentRole: 'Team Lead / Engineering Manager',
      CreatedAt: '2025-03-03T19:19:53.963Z',
      UpdatedAt: '2025-03-03T19:19:53.963Z',
    },
  ],
};

const getLevelCounts = (data: RoleMapResponse[]) => {
  const counts: Record<string, number> = {
    entry: 0,
    mid: 0,
    senior: 0,
    expert: 0,
  };

  data.forEach((role) => {
    if (counts[role.Level]) {
      counts[role.Level]++;
    }
  });

  return counts;
};

// Function to build the tree structure from flat data
const buildTree = (data: RoleMapResponse[]): TreeNode => {
  // Find the root node (with empty ParentRole)
  const rootRole = data.find((role) => role.ParentRole === '');

  if (!rootRole) {
    throw new Error('No root role found');
  }

  // Recursive function to build the tree
  const buildNode = (role: RoleMapResponse): TreeNode => {
    const children = data
      .filter((r) => r.ParentRole === role.Role)
      .map((childRole) => buildNode(childRole));

    return {
      name: role.Role,
      id: role.ID,
      level: role.Level,
      timeline: role.Timeline,
      skills: JSON.parse(role.SkillsNeeded),
      children,
      attributes: {
        level: role.Level,
      },
    };
  };

  return buildNode(rootRole);
};

export default function CareerTreePage() {
  // const { getAICareerTree } = useAIServicesStore();
  const { user } = useAuthStore();

  const { data, isPending } = useQuery<RoleMapResponse[]>({
    queryKey: ['careerTree'],
    queryFn: async () => {
      const response = await api.get<ApiReturn<RoleMapResponse[]>>(
        `${API_BASE_URL}/career-tree/${user?.email}`
      );
      return response.data.data;
    },
  });

  // useEffect(() => {
  //   const fetchContent = async () => {
  //     const resp = await getAICareerTree();
  //     setCareerTree(resp);
  //     const treeData = buildTree(resp);
  //     const levelCounts = getLevelCounts(resp);
  //     setTreeData(treeData);
  //     setLevelCounts(levelCounts);
  //     setLoading(false);
  //   };
  //   fetchContent();
  // }, []);

  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
  const [orientation, setOrientation] = useState<'vertical' | 'horizontal'>(
    'vertical'
  );

  // Custom node component for the tree
  const renderCustomNodeElement = ({ nodeDatum, toggleNode }: any) => {
    const levelColors = {
      entry: 'bg-blue-100 text-blue-800 border-blue-300',
      mid: 'bg-green-100 text-green-800 border-green-300',
      senior: 'bg-amber-100 text-amber-800 border-amber-300',
      expert: 'bg-purple-100 text-purple-800 border-purple-300',
    };

    const colorClass =
      levelColors[nodeDatum.level as keyof typeof levelColors] ||
      'bg-gray-100 text-gray-800 border-gray-300';

    return (
      <g>
        <foreignObject width={200} height={100} x={-100} y={-50}>
          <div
            className={`p-2 rounded-lg border-2 ${colorClass} shadow-md cursor-pointer transition-all hover:shadow-lg`}
            onClick={() => {
              toggleNode();
              setSelectedNode(nodeDatum);
            }}
          >
            <div className='font-medium text-sm truncate'>{nodeDatum.name}</div>
            <div className='text-xs flex items-center mt-1'>
              <Clock className='h-3 w-3 mr-1' />
              {nodeDatum.timeline}
            </div>
            <div className='flex items-center justify-center mt-2'>
              {nodeDatum.children.length > 0 && (
                <div className='text-xs flex items-center'>
                  {nodeDatum.__rd3t.collapsed ? (
                    <ChevronRight className='h-4 w-4' />
                  ) : (
                    <ChevronDown className='h-4 w-4' />
                  )}
                </div>
              )}
            </div>
          </div>
        </foreignObject>
      </g>
    );
  };

  if (isPending) {
    return <div>Loading...</div>;
  }

  return (
    <main className='min-h-screen '>
      <div className='max-w-7xl mx-auto'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          <div className='lg:col-span-2 bg-white rounded-lg border shadow-sm'>
            <div className='p-4 border-b flex justify-between items-center'>
              <h2 className='font-semibold'>Career Path Visualization</h2>
              <div className='flex space-x-2'>
                <Tabs>
                  <TabsList>
                    <TabsTrigger
                      value='vertical'
                      onClick={() => setOrientation('vertical')}
                      className={
                        orientation === 'vertical'
                          ? 'bg-primary text-primary-foreground'
                          : ''
                      }
                    >
                      Vertical
                    </TabsTrigger>
                    <TabsTrigger
                      value='horizontal'
                      onClick={() => setOrientation('horizontal')}
                      className={
                        orientation === 'horizontal'
                          ? 'bg-primary text-primary-foreground'
                          : ''
                      }
                    >
                      Horizontal
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
            <div className='h-[600px] w-full'>
              <Tree
                data={buildTree(data!)}
                orientation={orientation}
                renderCustomNodeElement={renderCustomNodeElement}
                pathFunc='step'
                separation={{ siblings: 2, nonSiblings: 2 }}
                translate={{
                  x: orientation === 'vertical' ? 400 : 200,
                  y: orientation === 'vertical' ? 50 : 300,
                }}
                zoom={0.7}
                zoomable={true}
                collapsible={true}
                nodeSize={{ x: 220, y: 120 }}
              />
            </div>
          </div>

          <div className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>Role Details</CardTitle>
                <CardDescription>
                  {selectedNode
                    ? `Information about ${selectedNode.name}`
                    : 'Select a role to view details'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedNode ? (
                  <div className='space-y-4'>
                    <div>
                      <h3 className='text-lg font-semibold'>
                        {selectedNode.name}
                      </h3>
                      <div className='flex items-center mt-1 text-sm text-muted-foreground'>
                        <Clock className='h-4 w-4 mr-1' />
                        <span>{selectedNode.timeline}</span>
                      </div>
                    </div>

                    <div>
                      <h4 className='text-sm font-medium mb-2'>Level</h4>
                      <Badge variant='outline' className='capitalize'>
                        {selectedNode.level}
                      </Badge>
                    </div>

                    <div>
                      <h4 className='text-sm font-medium mb-2'>
                        Skills Needed
                      </h4>
                      <div className='flex flex-wrap gap-2'>
                        {selectedNode.skills.map((skill, index) => (
                          <Badge key={index} variant='secondary'>
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className='text-sm font-medium mb-2'>
                        Potential Paths
                      </h4>
                      {selectedNode.children.length > 0 ? (
                        <ul className='space-y-2'>
                          {selectedNode.children.map((child) => (
                            <li
                              key={child.id}
                              className='flex items-center text-sm'
                            >
                              <ChevronRight className='h-4 w-4 mr-1 text-muted-foreground' />
                              {child.name}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className='text-sm text-muted-foreground'>
                          No further progression paths defined
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className='flex flex-col items-center justify-center py-8 text-center text-muted-foreground'>
                    <Briefcase className='h-12 w-12 mb-4 opacity-20' />
                    <p>
                      Click on any role in the tree to view detailed information
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* <Card>
              <CardHeader>
                <CardTitle>Career Level Distribution</CardTitle>
                <CardDescription>
                  Number of roles at each career level
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  {Object.entries(levelCounts).map(([level, count]) => (
                    <div key={level} className='flex items-center'>
                      <div className='w-24 capitalize'>{level}</div>
                      <div className='flex-1 h-2 bg-gray-100 rounded-full overflow-hidden'>
                        <div
                          className={`h-full rounded-full ${
                            level === 'entry'
                              ? 'bg-blue-500'
                              : level === 'mid'
                              ? 'bg-green-500'
                              : level === 'senior'
                              ? 'bg-amber-500'
                              : 'bg-purple-500'
                          }`}
                          style={{
                            width: `${
                              (count / apiResponse.data.length) * 100
                            }%`,
                          }}
                        />
                      </div>
                      <div className='w-8 text-right text-sm text-muted-foreground'>
                        {count}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card> */}

            <Card>
              <CardHeader>
                <CardTitle>Legend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-2'>
                  <div className='flex items-center'>
                    <div className='w-4 h-4 rounded bg-blue-100 border border-blue-300 mr-2'></div>
                    <span className='text-sm'>Entry Level</span>
                  </div>
                  <div className='flex items-center'>
                    <div className='w-4 h-4 rounded bg-green-100 border border-green-300 mr-2'></div>
                    <span className='text-sm'>Mid Level</span>
                  </div>
                  <div className='flex items-center'>
                    <div className='w-4 h-4 rounded bg-amber-100 border border-amber-300 mr-2'></div>
                    <span className='text-sm'>Senior Level</span>
                  </div>
                  <div className='flex items-center'>
                    <div className='w-4 h-4 rounded bg-purple-100 border border-purple-300 mr-2'></div>
                    <span className='text-sm'>Expert Level</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
