'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  AcceptButton,
  RejectButton,
  DeleteButton,
  EditButton,
  CreateButton,
  SendButton,
  LoveButton,
  StarButton,
  DownloadButton,
  ShareButton,
  ButtonGroup,
  ActionBar,
} from '@/components/ui/action-buttons';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function ButtonShowcase() {
  const [isLoved, setIsLoved] = React.useState(false);
  const [isStarred, setIsStarred] = React.useState(false);

  return (
    <div className="space-y-8 p-8 max-w-6xl mx-auto">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold gradient-primary bg-clip-text text-transparent">
          LigaBairro Button System
        </h1>
        <p className="text-lg text-muted-foreground">
          A comprehensive collection of buttons with delightful animations and interactions
        </p>
      </div>

      {/* Button Variants */}
      <Card>
        <CardHeader>
          <CardTitle>Button Variants</CardTitle>
          <CardDescription>Different button styles for various use cases</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <Button variant="default">Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
            <Button variant="gradient">Gradient</Button>
            <Button variant="glass">Glass</Button>
            <Button variant="neon">Neon</Button>
            <Button variant="soft">Soft</Button>
            <Button variant="accept">Accept</Button>
            <Button variant="reject">Reject</Button>
            <Button variant="success">Success</Button>
            <Button variant="warning">Warning</Button>
            <Button variant="info">Info</Button>
            <Button variant="premium">Premium</Button>
            <Button variant="cta">Call to Action</Button>
            <Button variant="minimal">Minimal</Button>
            <Button variant="celebration">Celebration</Button>
            <Button variant="magic">Magic</Button>
            <Button variant="love">Love</Button>
          </div>
        </CardContent>
      </Card>

      {/* Button Sizes */}
      <Card>
        <CardHeader>
          <CardTitle>Button Sizes</CardTitle>
          <CardDescription>Various button sizes for different contexts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-end space-x-4">
            <Button size="xs" variant="outline">Extra Small</Button>
            <Button size="sm" variant="outline">Small</Button>
            <Button size="default" variant="outline">Default</Button>
            <Button size="lg" variant="outline">Large</Button>
            <Button size="xl" variant="outline">Extra Large</Button>
            <Button size="xxl" variant="outline">2X Large</Button>
          </div>
          <div className="flex items-center space-x-4">
            <Button size="icon-sm" variant="outline">🔔</Button>
            <Button size="icon" variant="outline">⚙️</Button>
            <Button size="icon-lg" variant="outline">❤️</Button>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Specialized Action Buttons</CardTitle>
          <CardDescription>Purpose-built buttons for common actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AcceptButton />
            <RejectButton />
            <DeleteButton />
            <EditButton />
            <CreateButton />
            <SendButton />
            <DownloadButton />
            <ShareButton />
          </div>
          
          <div className="flex items-center space-x-4">
            <LoveButton 
              isLoved={isLoved} 
              onClick={() => setIsLoved(!isLoved)}
            >
              {isLoved ? 'Amado' : 'Amar'}
            </LoveButton>
            <StarButton 
              isStarred={isStarred} 
              onClick={() => setIsStarred(!isStarred)}
            >
              {isStarred ? 'Com Estrela' : 'Dar Estrela'}
            </StarButton>
          </div>
        </CardContent>
      </Card>

      {/* Button Groups */}
      <Card>
        <CardHeader>
          <CardTitle>Button Groups</CardTitle>
          <CardDescription>Grouped buttons for related actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-medium mb-3">Accept/Reject Actions</h4>
            <ButtonGroup>
              <AcceptButton size="sm" />
              <RejectButton size="sm" />
            </ButtonGroup>
          </div>
          
          <div>
            <h4 className="font-medium mb-3">CRUD Operations</h4>
            <ButtonGroup spacing="loose">
              <CreateButton size="sm" />
              <EditButton size="sm" />
              <DeleteButton size="sm" />
            </ButtonGroup>
          </div>
          
          <div>
            <h4 className="font-medium mb-3">Vertical Group</h4>
            <ButtonGroup orientation="vertical" spacing="tight">
              <Button variant="outline" size="sm">Opção 1</Button>
              <Button variant="outline" size="sm">Opção 2</Button>
              <Button variant="outline" size="sm">Opção 3</Button>
            </ButtonGroup>
          </div>
        </CardContent>
      </Card>

      {/* Loading States */}
      <Card>
        <CardHeader>
          <CardTitle>Loading States</CardTitle>
          <CardDescription>Buttons with loading indicators</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Button loading loadingText="A processar...">Default Loading</Button>
            <AcceptButton loading loadingText="A aceitar..." />
            <SendButton loading loadingText="A enviar..." />
            <CreateButton loading loadingText="A criar..." />
          </div>
        </CardContent>
      </Card>

      {/* Interactive Demonstrations */}
      <Card>
        <CardHeader>
          <CardTitle>Interactive Examples</CardTitle>
          <CardDescription>Real-world usage scenarios</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Request Application Actions */}
          <div className="p-4 border border-border/50 rounded-lg">
            <h4 className="font-medium mb-2">📝 Application Review</h4>
            <p className="text-sm text-muted-foreground mb-4">
              João Silva candidatou-se para ajudar com "Mudança de Móveis"
            </p>
            <ButtonGroup>
              <AcceptButton onClick={() => alert('Candidatura aceite!')} />
              <RejectButton onClick={() => alert('Candidatura rejeitada!')} />
            </ButtonGroup>
          </div>

          {/* Content Creation */}
          <div className="p-4 border border-border/50 rounded-lg">
            <h4 className="font-medium mb-2">🆕 Create New Request</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Ready to post a new help request?
            </p>
            <CreateButton onClick={() => alert('Criar novo pedido!')}>
              Criar Pedido de Ajuda
            </CreateButton>
          </div>

          {/* Social Actions */}
          <div className="p-4 border border-border/50 rounded-lg">
            <h4 className="font-medium mb-2">💫 Social Interactions</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Interact with community content
            </p>
            <ButtonGroup>
              <LoveButton 
                isLoved={isLoved} 
                onClick={() => setIsLoved(!isLoved)}
                size="sm"
              />
              <StarButton 
                isStarred={isStarred} 
                onClick={() => setIsStarred(!isStarred)}
                size="sm"
              />
              <ShareButton size="sm" />
            </ButtonGroup>
          </div>
        </CardContent>
      </Card>

      {/* Action Bar Example */}
      <ActionBar>
        <Button variant="ghost">Cancelar</Button>
        <Button variant="cta">Guardar Alterações</Button>
      </ActionBar>
    </div>
  );
}